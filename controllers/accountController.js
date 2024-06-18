const db = require('../config/db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const { createNotification } = require('./notificationController');
const { generateOTP, sendOTPEmail } = require('../utils/otpGeneration');

// Generate OTP for account actions
exports.generateOTP = async (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT email FROM users WHERE id = ?';
    db.query(query, [userId], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).send('Error fetching user email');
        }

        const email = results[0].email;
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

        const insertOtpQuery = 'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)';
        db.query(insertOtpQuery, [email, otp, expiresAt], async (err) => {
            if (err) {
                console.error('Error storing OTP:', err);
                return res.status(500).send('Error storing OTP');
            }
            console.log(`OTP ${otp} stored for email ${email}`);
            await sendOTPEmail(email, otp);
            res.status(200).send('OTP sent to your registered email.');
        });
    });
};

// Verify OTP and complete actions
exports.verifyOTP = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user.id;

    const query = 'SELECT email FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).send('Error fetching user email');
        }

        const email = results[0].email;

        const checkOtpQuery = 'SELECT * FROM otps WHERE email = ? AND otp = ?';
        db.query(checkOtpQuery, [email, otp], async (err, results) => {
            if (err || results.length === 0) {
                console.error(`Invalid or expired OTP for email ${email}`);
                return res.status(400).send('Invalid or expired OTP.');
            }

            const otpData = results[0];
            if (new Date() > new Date(otpData.expires_at)) {
                console.error(`Expired OTP for email ${email}`);
                return res.status(400).send('Invalid or expired OTP.');
            }

            // Fetch user details
            const userQuery = 'SELECT username, email FROM users WHERE id = ?';
            db.query(userQuery, [userId], (err, results) => {
                if (err || results.length === 0) {
                    return res.status(500).send('Error fetching user details');
                }

                const user = results[0];
                res.status(200).json({ username: user.username, email: user.email });
            });
        });
    });
};

// Edit Account
exports.editAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, username } = req.body;
    const userId = req.user.id;

    const updateQuery = 'UPDATE users SET email = ?, username = ? WHERE id = ?';
    db.query(updateQuery, [email, username, userId], (err, results) => {
        if (err) {
            console.error('Error updating account:', err);
            return res.status(500).send('Error updating account');
        }

        // Create a notification
        const message = 'Your account details have been updated.';
        createNotification(userId, 'account_update', message);

        res.status(200).send('Account updated successfully');
    });
};
