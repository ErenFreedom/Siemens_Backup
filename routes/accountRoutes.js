const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/account/logout', authenticateToken, accountController.logout);
router.post('/account/generate-otp', authenticateToken, accountController.generateDeleteAccountOTP);
router.post('/account/verify-otp', authenticateToken, [
    check('otp', 'OTP is required').notEmpty()
], accountController.verifyDeleteAccountOTP);

module.exports = router;
