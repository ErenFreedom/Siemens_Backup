const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middlewares/authenticateToken');

// Verify Password
router.post('/account/verify-password', authenticateToken, [
    check('password', 'Password is required').notEmpty(),
], accountController.verifyPassword);

// Edit Account
router.put('/account/edit', authenticateToken, [
    check('email', 'Email is required').isEmail(),
    check('username', 'Username is required').notEmpty()
], accountController.editAccount);

// Change Password
router.put('/account/change-password', authenticateToken, [
    check('oldPassword', 'Old password is required').notEmpty(),
    check('newPassword', 'New password is required').isLength({ min: 6 })
], accountController.changePassword);

// Delete Account
router.delete('/account/delete', authenticateToken, accountController.deleteAccount);

module.exports = router;
