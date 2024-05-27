const express = require('express');
const { startLogging, stopLogging } = require('./logger');

const router = express.Router();

router.post('/logger/start', (req, res) => {
    const { interval } = req.body;
    startLogging(interval || 60000); // Default to 1 minute if no interval is provided
    res.send('Started logging data.');
});

router.post('/logger/stop', (req, res) => {
    stopLogging();
    res.send('Stopped logging data.');
});

module.exports = router;
