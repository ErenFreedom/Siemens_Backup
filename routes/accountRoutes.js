const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/account/generate-otp', authenticateToken, accountController.generateOTP);
router.post('/account/verify-otp', authenticateToken, [
    check('otp', 'OTP is required').notEmpty()
], accountController.verifyOTP);
router.put('/account/edit', authenticateToken, [
    check('newPassword', 'New Password is required').isLength({ min: 6 })
], accountController.editAccount);
router.get('/account/current', authenticateToken, accountController.getCurrentUserDetails);

module.exports = router;
