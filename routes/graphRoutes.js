const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const graphController = require('../controllers/graphController');

// Routes to get data for graphs
router.get('/graph/temp/1day', authenticateToken, graphController.getTempData1Day);
router.get('/graph/temp/1week', authenticateToken, graphController.getTempData1Week);
router.get('/graph/temp/1month', authenticateToken, graphController.getTempData1Month);

module.exports = router;
