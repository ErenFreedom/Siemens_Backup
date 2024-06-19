const express = require('express');
const router = express.Router();
const { checkThresholds } = require('../controllers/monitorController');
const authenticateToken = require('../middlewares/authenticateToken');

// Route to check thresholds
router.get('/monitor/check', authenticateToken, checkThresholds);

module.exports = router;
