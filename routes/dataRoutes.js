const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const dataController = require('../controllers/dataController');

// Route to receive data
router.post('/data', authenticateToken, dataController.insertData);

module.exports = router;
