// routes/monitorRoutes.js
const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

// Fetch notifications based on threshold breaches
router.get('/notifications', monitorController.checkThresholds);

module.exports = router;
