const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/data', authenticateToken, dataController.postData);
router.get('/data', authenticateToken, dataController.getData);

module.exports = router;
