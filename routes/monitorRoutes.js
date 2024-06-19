// monitorRoutes.js
const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/monitor', authenticateToken, monitorController.monitorThresholds);

module.exports = router;
