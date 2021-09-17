const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios').default;
const FormData = require('form-data');

/* Construct dotEnv */
dotenv.config();

/* Set geonames API variable */
const geonamesBaseUrl = 'http://api.geonames.org/postalCodeSearchJSON?maxRows=10&placename='
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

const getLatitude = (req, res) => {
    const destination = req.body.destination;
    const departure = req.body.departure;
    res.send(JSON.stringify('success'));
}


app.post('/form', getLatitude);
