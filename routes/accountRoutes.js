const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authenticateToken = require('../middlewares/authenticateToken');
const accountController = require('../controllers/accountController');

// Generate OTP
router.post('/account/generate-otp', authenticateToken, accountController.generateOTP);

// Verify OTP
router.post('/account/verify-otp', authenticateToken, [
    check('otp', 'OTP is required').notEmpty()
], accountController.verifyOTP);

// Edit Account
router.put('/account/edit', authenticateToken, [
    check('email', 'Email is required').isEmail(),
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required and must be at least 6 characters').isLength({ min: 6 })
], accountController.editAccount);

// Get Current User Details
router.get('/account/current', authenticateToken, accountController.getCurrentUserDetails);

module.exports = router;
