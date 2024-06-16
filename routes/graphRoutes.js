const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const graphController = require('../controllers/graphController');

// Routes to get data for graphs
router.get('/graph/temp/:filter', authenticateToken, graphController.getTempData);

module.exports = router;
