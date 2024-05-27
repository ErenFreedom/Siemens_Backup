const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const { generateOTP, sendOTPEmail, decryptData } = require('../utils/otpGeneration');

const secretKey = process.env.SECRET_KEY;

const otps = new Map(); // To store OTPs temporarily

// Register a new user
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;
    const decryptedPassword = decryptData(password);

    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkQuery, [email, username], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).send('Error checking user');
        }

        if (results.length > 0) {
            return res.status(400).send('Email or Username already exists');
        }

        const otp = generateOTP();
        otps.set(email, { otp, username, password: decryptedPassword, expiresAt: Date.now() + 2 * 60 * 1000 });
        await sendOTPEmail(email, otp);

        res.status(200).send('OTP sent to your email. Complete registration by verifying the OTP.');
    });
};

// Verify OTP and complete registration
exports.verifyRegistration = async (req, res) => {
    const { email, otp } = req.body;
    const storedOtpData = otps.get(email);

    if (!storedOtpData || storedOtpData.expiresAt < Date.now() || storedOtpData.otp !== otp) {
        return res.status(400).send('Invalid or expired OTP.');
    }

    const hashedPassword = await bcrypt.hash(storedOtpData.password, 10);
    const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    db.query(query, [email, storedOtpData.username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).send('Error registering user');
        }
        otps.delete(email);
        res.send('User registered successfully');
    });
};

// Login user
exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body; // identifier can be email or username
    const decryptedPassword = decryptData(password);

    const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(query, [identifier, identifier], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }
        const user = results[0];
        const validPassword = await bcrypt.compare(decryptedPassword, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid credentials');
        }

        const otp = generateOTP();
        otps.set(user.email, { otp, expiresAt: Date.now() + 2 * 60 * 1000 });
        await sendOTPEmail(user.email, otp);

        res.status(200).send('OTP sent to your email. Complete login by verifying the OTP.');
    });
};

// Verify OTP and complete login
exports.verifyLogin = async (req, res) => {
    const { email, otp } = req.body;
    const storedOtpData = otps.get(email);

    if (!storedOtpData || storedOtpData.expiresAt < Date.now() || storedOtpData.otp !== otp) {
        return res.status(400).send('Invalid or expired OTP.');
    }

    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    otps.delete(email);
    res.json({ token });
};
