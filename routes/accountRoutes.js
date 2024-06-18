const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middlewares/authenticateToken');

// Use the authenticateToken middleware
router.use(authenticateToken);

// Generate OTP
router.post('/account/generate-otp', accountController.generateOTP);

// Verify OTP
router.post('/account/verify-otp', [
    check('otp', 'OTP is required').notEmpty()
], accountController.verifyOTP);

// Edit Account
router.put('/account/edit', [
    check('currentPassword', 'Current Password is required').isLength({ min: 6 }),
    check('newPassword', 'New Password is required').isLength({ min: 6 })
], accountController.editAccount);

// Get Current User Details
router.get('/account/current', accountController.getCurrentUserDetails);

module.exports = router;
