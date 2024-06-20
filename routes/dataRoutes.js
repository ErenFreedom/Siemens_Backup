const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Route for inserting temp data
router.post('/temp', dataController.insertTempData);

// Route for inserting rh data
router.post('/rh', dataController.insertRhData);

module.exports = router;
