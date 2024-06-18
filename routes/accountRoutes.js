const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/account/logout', authenticateToken, accountController.logout);
router.delete('/account/delete', authenticateToken, [
    check('password', 'Password is required').notEmpty()
], accountController.deleteAccount);

module.exports = router;
