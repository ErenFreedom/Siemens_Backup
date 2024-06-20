// routes/monitorRoutes.js
const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const db = require('../config/db');

// Fetch notifications based on threshold breaches
router.get('/notifications', monitorController.fetchNotifications);

module.exports = router;
