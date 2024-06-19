const express = require('express');
const { checkThresholds, getNotifications } = require('../controllers/monitorController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.get('/monitor', authenticateToken, checkThresholds);
router.get('/notifications', authenticateToken, getNotifications);

module.exports = router;
