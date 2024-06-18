const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');

// Generate OTP
router.post('/account/generate-otp', accountController.generateOTP);

// Verify OTP
router.post('/account/verify-otp', [
    check('otp', 'OTP is required').notEmpty()
], accountController.verifyOTP);

// Edit Account
router.put('/account/edit', [
    check('email', 'Email is required').isEmail(),
    check('username', 'Username is required').notEmpty()
], accountController.editAccount);

module.exports = router;
