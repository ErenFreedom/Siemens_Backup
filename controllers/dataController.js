const axios = require('axios');
const db = require('../config/db');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

// Function to get token from the local server
async function getLocalServerToken() {
    try {
        const response = await axios.post('https://192.168.22.160:443/WebServiceApplication/api/token', {
            username: process.env.LOCAL_SERVER_USERNAME,
            password: process.env.LOCAL_SERVER_PASSWORD
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) // Ignore self-signed certificate error
        });
        return response.data.token;
    } catch (error) {
        console.error('Error fetching local server token:', error);
        throw new Error('Error fetching local server token');
    }
}

// Function to fetch data from the local server
async function fetchDataFromLocalServer(endpoint, token) {
    try {
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) // Ignore self-signed certificate error
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from local server:', error);
        throw new Error('Error fetching data from local server');
    }
}

// Post data endpoint
exports.postData = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Get token from local server
        const token = await getLocalServerToken();

        // Fetch temperature data
        const temperatureData = await fetchDataFromLocalServer(
            'https://192.168.22.160/WebServiceApplication/api/values/System1.LogicalView:LogicalView.BACNETNETWORK.B.F1.SA1.plant.T;.Present_Value',
            token
        );

        // Fetch air quality data
        const airQualityData = await fetchDataFromLocalServer(
            'https://192.168.22.160/WebServiceApplication/api/values/System1.LogicalView:LogicalView.BACNETNETWORK.B.F1.SA1.plant.AQualR;.Present_Value',
            token
        );

        // Insert temperature data into the database
        const tempQuery = 'INSERT INTO automation_data (type, value, timestamp) VALUES (?, ?, ?)';
        db.query(tempQuery, ['temperature', temperatureData[0].Value.Value, new Date().toISOString()], (err, results) => {
            if (err) {
                console.error('Error inserting temperature data:', err);
                return res.status(500).send('Error inserting temperature data');
            }
        });

        // Insert air quality data into the database
        const airQualityQuery = 'INSERT INTO automation_data (type, value, timestamp) VALUES (?, ?, ?)';
        db.query(airQualityQuery, ['air_quality', airQualityData[0].Value.Value, new Date().toISOString()], (err, results) => {
            if (err) {
                console.error('Error inserting air quality data:', err);
                return res.status(500).send('Error inserting air quality data');
            }
        });

        res.send('Data received and stored successfully');
    } catch (error) {
        res.status(500).send('Error processing data');
    }
};

// Get data endpoint
exports.getData = (req, res) => {
    const { type } = req.query;
    const query = type ? 'SELECT * FROM automation_data WHERE type = ?' : 'SELECT * FROM automation_data';
    db.query(query, [type], (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).send('Error retrieving data');
        }
        res.json(results);
    });
};
