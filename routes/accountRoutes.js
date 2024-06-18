const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middlewares/authMiddleware');

// Generate OTP
router.post('/account/generate-otp', authenticateToken, accountController.generateOTP);

// Verify OTP
router.post('/account/verify-otp', authenticateToken, [
    check('otp', 'OTP is required').notEmpty()
], accountController.verifyOTP);

// Edit Account
router.put('/account/edit', authenticateToken, [
    check('currentPassword', 'Current Password is required').isLength({ min: 6 }),
    check('newPassword', 'New Password is required').isLength({ min: 6 })
], accountController.editAccount);

// Get Current User Details
router.get('/account/current', authenticateToken, accountController.getCurrentUserDetails);

module.exports = router;
