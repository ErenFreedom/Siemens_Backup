const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register', [
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res, next) => {
    console.log('Register route hit');
    next();
}, authController.register);

router.post('/verify-registration', [
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('otp').isNumeric().withMessage('OTP must be numeric').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits long')
], (req, res, next) => {
    console.log('Verify registration route hit');
    next();
}, authController.verifyRegistration);

router.post('/login', [
    check('identifier').isLength({ min: 3 }).withMessage('Identifier must be at least 3 characters long'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res, next) => {
    console.log('Login route hit');
    next();
}, authController.login);

router.post('/verify-login', [
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('otp').isNumeric().withMessage('OTP must be numeric').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits long')
], (req, res, next) => {
    console.log('Verify login route hit');
    next();
}, authController.verifyLogin);

module.exports = router;
