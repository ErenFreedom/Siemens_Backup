const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const accountController = require('../controllers/accountController');

// Verify Password
router.post('/account/verify-password',  [
    check('password', 'Password is required').notEmpty(),
], accountController.verifyPassword);

// Edit Account
router.put('/account/edit',  [
    check('email', 'Email is required').isEmail(),
    check('username', 'Username is required').notEmpty()
], accountController.editAccount);

// Change Password
router.put('/account/change-password',  [
    check('oldPassword', 'Old password is required').notEmpty(),
    check('newPassword', 'New password is required').isLength({ min: 6 })
], accountController.changePassword);

// Delete Account
router.delete('/account/delete', accountController.deleteAccount);

module.exports = router;
