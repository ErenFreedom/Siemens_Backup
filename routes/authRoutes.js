const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register', [
    check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.register);

router.post('/login', [
    check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.login);

module.exports = router;
