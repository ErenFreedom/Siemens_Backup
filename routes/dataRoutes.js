const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const dataController = require('../controllers/dataController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/data', authenticateToken, [ 
    check('type').isAlpha().withMessage('Type must be alphabetic'),
    check('value').isNumeric().withMessage('Value must be numeric')
], dataController.postData);

router.get('/data', authenticateToken, dataController.getData);

module.exports = router;
