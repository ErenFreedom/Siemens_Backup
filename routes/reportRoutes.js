const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authenticateToken'); // Make sure this path is correct

router.post('/report/generate', authMiddleware, reportController.generateReport);

module.exports = router;
