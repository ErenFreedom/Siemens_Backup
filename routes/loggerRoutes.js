const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { startLogging, stopLogging } = require('../dataLogger/logger');

const router = express.Router();
const secretKey = process.env.SECRET_KEY;

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

router.post('/logger/start', authenticateToken, (req, res) => {
    const { interval } = req.body;
    startLogging(interval || 30000); // Default to 30 seconds if no interval is provided
    res.send('Started logging data.');
});

router.post('/logger/stop', authenticateToken, (req, res) => {
    stopLogging();
    res.send('Stopped logging data.');
});

module.exports = router;
