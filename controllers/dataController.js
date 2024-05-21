const db = require('../config/db');
const { check, validationResult } = require('express-validator');

exports.postData = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { type, value } = req.body;
    const query = 'INSERT INTO automation_data (type, value, timestamp) VALUES (?, ?, ?)';
    db.query(query, [type, value, new Date().toISOString()], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        res.send('Data received and stored successfully');
    });
};

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
