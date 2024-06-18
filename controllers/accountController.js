const db = require('../config/db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const { generateOTP, sendOTPEmail } = require('../utils/otpGeneration');
const { createNotification } = require('./notificationController');

// Generate OTP
exports.generateOTP = async (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT email FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found.');
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
            res.status(200).send('OTP sent to your email.');
        });
    });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user.userId;

    const query = 'SELECT email, username FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found.');
        }

        const { email, username } = results[0];
        const checkOtpQuery = 'SELECT * FROM otps WHERE email = ? AND otp = ?';
        db.query(checkOtpQuery, [email, otp], (err, results) => {
            if (err || results.length === 0) {
                console.error(`Invalid or expired OTP for email ${email}`);
                return res.status(400).send('Invalid or expired OTP.');
            }

            const otpData = results[0];
            if (new Date() > new Date(otpData.expires_at)) {
                console.error(`Expired OTP for email ${email}`);
                return res.status(400).send('Invalid or expired OTP.');
            }

            const deleteOtpQuery = 'DELETE FROM otps WHERE email = ?';
            db.query(deleteOtpQuery, [email], (err) => {
                if (err) {
                    console.error('Error deleting OTP:', err);
                }
            });

            res.status(200).json({ email, username, userId });
        });
    });
};

// Edit Account
exports.editAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const query = 'SELECT password FROM users WHERE id = ?';
    db.query(query, [userId], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found.');
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).send('Current password is incorrect.');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateQuery, [hashedNewPassword, userId], (err) => {
            if (err) {
                console.error('Error updating account:', err);
                return res.status(500).send('Error updating account');
            }

            // Create a notification
            const message = 'Your account password has been updated.';
            createNotification(userId, 'account_update', message);

            res.status(200).send('Account updated successfully');
        });
    });
};

// Get Current User Details
exports.getCurrentUserDetails = (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT email, username FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found.');
        }

        const { email, username } = results[0];
        res.status(200).json({ email, username });
    });
};
