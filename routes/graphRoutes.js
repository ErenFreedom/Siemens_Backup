const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const graphController = require('../controllers/graphController');

// Routes to get data for graphs
router.get('/graph/temp/1day', authenticateToken, graphController.getTempData1Day);
router.get('/graph/temp/1week', authenticateToken, graphController.getTempData1Week);
router.get('/graph/temp/1month', authenticateToken, graphController.getTempData1Month);

router.get('/graph/rh/1day', authenticateToken, graphController.getRhData1Day);
router.get('/graph/rh/1week', authenticateToken, graphController.getRhData1Week);
router.get('/graph/rh/1month', authenticateToken, graphController.getRhData1Month);

router.get('/graph/pressure/1day', authenticateToken, graphController.getPressureData1Day);
router.get('/graph/pressure/1week', authenticateToken, graphController.getPressureData1Week);
router.get('/graph/pressure/1month', authenticateToken, graphController.getPressureData1Month);

router.get('/graph/humidity/1day', authenticateToken, graphController.getHumidityData1Day);
router.get('/graph/humidity/1week', authenticateToken, graphController.getHumidityData1Week);
router.get('/graph/humidity/1month', authenticateToken, graphController.getHumidityData1Month);

module.exports = router;
