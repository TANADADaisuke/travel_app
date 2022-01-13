const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios').default;
const FormData = require('form-data');
const { resolveSoa } = require('dns');

/* Construct dotEnv */
dotenv.config();

/* Set geonames API variable */
const geonamesBaseUrl = 'http://api.geonames.org/postalCodeSearchJSON?maxRows=10&placename=';
const countryUrl = 'http://api.geonames.org/countryInfoJSON?country=';
const geonamesUsername = process.env.GEONAMES_ID;

/* Set Weatherbit API variable */
const weatherbitBaseUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?key=';
const weatherbitApiKey = process.env.WEATHERBIT_API_KEY;

/* Set pixabay API variable */
const pixabayBaseUrl = 'https://pixabay.com/api/?key=';
const pixabayApiKey = process.env.PIXABAY_KEY;

// Setup empty JS object to act as endpoint for all routes
let projectData = {};
// prepare trip list and id
projectData['trip'] = [];
projectData['id'] = 0;

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


// Helper functions
const getToday = () => {
    const d = new Date()
    let today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), - d.getTimezoneOffset() / 60, 0, 0, 0);
    return today;
}

// GET Route
const sendData = (req, res) => {
    res.send(projectData);
    console.log('/all: success', projectData);
}

app.get('/all', sendData);


// POST /form
// get geocode from geonames api
const geonamesResponse = async (destination) => {
    try {
        const geonamesUrl = geonamesBaseUrl + destination + '&username=' + geonamesUsername;
        const res = await axios.get(geonamesUrl);
        return res.data;
    } catch(error) {
        console.log('error:', error);
    }
}

// get weather from weatherbit api
const weatherbitResponse = async (lat, lon) => {
    try {
        const weatherbitUrl = weatherbitBaseUrl + weatherbitApiKey + '&lat=' + lat + '&lon=' + lon;
        const res = await axios.get(weatherbitUrl);
        return res.data;
    } catch(error) {
        console.log('error:', error);
    }
}

// get photo image url from pixabay api
const pixabayResponse = async (city, country) => {
    try {
        const pixabayUrl = pixabayBaseUrl + pixabayApiKey + '&q=' + city + '+' + country + '&image_type=photo';
        const res = await axios.get(pixabayUrl);
        // extract first photo url
        if (res.data.total === 0) {
            return pixabayResponseCountry(country);
        } else {
            const firstHit = res.data.hits[0];
            return firstHit.webformatURL;
        }
    } catch(error) {
        console.log('error:', error);
    }
}

// get country photo image url from pixabay in case with no city image
const pixabayResponseCountry = async (country) => {
    try {
        const pixabayUrl = pixabayBaseUrl + pixabayApiKey + '&q=' + country + '&image_type=photo';
        const res = await axios.get(pixabayUrl);
        // extract first photo url
        if (res.data.total === 0) {
            return 'no image';
        } else {
            const firstHit = res.data.hits[0];
            return firstHit.webformatURL;
        }
    } catch(error) {
        console.log('error:', error);
    }
}

// main function for response to form submission
const responseToForm = (req, res) => {
    const destination = req.body.destination;
    const departure = new Date(req.body.departure);
    geonamesResponse(encodeURIComponent(destination))
    .then(data => {
        // set geocode property
        const firstEntry = data.postalCodes[0];
        const result = {
            'destination': destination,
            'departure': departure,
            'lon': firstEntry.lng,
            'lat': firstEntry.lat,
            'countryCode': firstEntry.countryCode
        };
        return result;
    })
    .then(async data => {
        // set country name property
        const url = countryUrl + data.countryCode + '&username=' + geonamesUsername;
        const res = await axios.get(url);
        const countryName = res.data.geonames[0].countryName;
        data.countryName = countryName;
        return data;
    })
    .then(data => {
        // set duration property
        const today = getToday();
        const duration = departure.getTime() - today.getTime();
        data.countdown = duration / 86400000;
        return data;
    })
    .then(async data => {
        // get weather from weatherbit api
        const weather = await weatherbitResponse(data.lat, data.lon);
        data.weather = weather.data;
        return data;
    })
    .then(async data => {
        // get photo url from pixabay api
        const photoUrl = await pixabayResponse(data.destination, data.countryName);
        data.photourl = photoUrl;
        return data;
    })
    .then(data => {
        // add data id
        data.id = projectData.id + 1;
        // update projecdtData id
        projectData.id += 1;
        // save trip in projectData
        projectData.trip.push(data);
        // send success data
        data.success = true;
        res.send(JSON.stringify(data));
    })
    .catch(error => {
        console.log('error:', error)
        res.send(JSON.stringify({
            'success': false
        }));
    });
}

app.post('/form', responseToForm);

// POST /remove
const responseToRemove = (req, res) => {
    const dataId = req.body.dataId;
    // remove trip from projectData
    for (let i = 0; i < projectData.trip.length; i++) {
        if (projectData.trip[i].id === dataId) {
            projectData.trip.splice(i, 1);
        }
    }
    res.send(JSON.stringify({
        'success': true,
        'removed': dataId
    }));
}


app.post('/remove', responseToRemove);