const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios').default;
const FormData = require('form-data');

/* Construct dotEnv */
dotenv.config();

/* Set geonames API variable */
const geonamesBaseUrl = 'http://api.geonames.org/postalCodeSearchJSON?maxRows=10&placename=';
const countryUrl = 'http://api.geonames.org/countryInfoJSON?country=';
const geonamesUsername = process.env.GEONAMES_ID;

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

/* Create and app instance */
const app = express();

/* Dependencies */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
/* Cors for cross origin allowance */
app.use(cors());


// Initialize the main project folder
app.use(express.static('dist'));

// Log directory name
console.log(__dirname)

// Setup Server
const port = 8080;
const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
}


// GET Route
const sendData = (req, res) => {
    res.send(projectData);
    console.log('/all: success', projectData);
}

app.get('/all', sendData);


// POST Route
const addWeather = (req, res) => {
    projectData['temperature'] = req.body.temperature;
    projectData['date'] = req.body.date;
    projectData['response'] = req.body.response
    res.send(projectData);
    console.log('/addWeather: success', projectData);
} 

app.post('/addWeather', addWeather);

// POST /form
const geonamesResponse = async (destination) => {
    try {
        const geonamesUrl = geonamesBaseUrl + destination + '&username=' + geonamesUsername;
        const res = await axios.get(geonamesUrl);
        return res.data;
    } catch(error) {
        console.log('error:', error);
    }
}

const getCountryName = async (countryCode) => {
    try {
        const url = countryUrl + countryCode + '&username=' + geonamesUsername;
        const res = await axios.get(url);
        const countryName = res.data.geonames[0].countryName;
        return countryName;
    } catch(error) {
        console.log('error:', error)
    }
}

const responseToForm = (req, res) => {
    const destination = req.body.destination;
    const departure = req.body.departure;
    geonamesResponse(destination)
    .then(data => {
        const firstEntry = data.postalCodes[0];
        const result = {
            'lng': firstEntry.lng,
            'lat': firstEntry.lat,
            'countryCode': firstEntry.countryCode
        };
        return result;
    })
    .then(data => {
        getCountryName(data.countryCode)
        .then(countryName => {
            data.countryName = countryName;
            data.success = true;
            res.send(JSON.stringify(data));    
        })
        .catch(error => {
            console.log('error:', error)
            res.send(JSON.stringify({
                'success': false
            }));
        })
    })
    .catch(error => {
        console.log('error:', error)
        res.send(JSON.stringify({
            'success': false
        }));
    });
}

app.post('/form', responseToForm);
