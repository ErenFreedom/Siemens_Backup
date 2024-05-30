const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

// Connect to MySQL database on RDS
const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 30000 // Increase timeout to 30 seconds
});

mysqlConnection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Route to receive data
router.post('/data', (req, res) => {
    const data = req.body;
    const query = 'INSERT INTO fetched_data (type, value, quality, qualityGood, timestamp, originalObjectOrPropertyId, objectId, propertyName, attributeId, errorCode, isArray) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        data.type,
        data.value,
        data.quality,
        data.qualityGood,
        data.timestamp,
        data.originalObjectOrPropertyId,
        data.objectId,
        data.propertyName,
        data.attributeId,
        data.errorCode,
        data.isArray
    ];

    mysqlConnection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Error inserting data');
        } else {
            console.log('Data inserted successfully into MySQL:', results.insertId);
            res.status(200).send('Data inserted successfully');
        }
    });
});

module.exports = router;
