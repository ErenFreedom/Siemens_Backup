const db = require('../config/db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const { createNotification } = require('./notificationController');
const { generateOTP, sendOTPEmail } = require('../utils/otpGeneration');

// Generate and send OTP
exports.generateOTP = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const query = 'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)';
    db.query(query, [email, otp, expiresAt], async (err) => {
        if (err) {
            console.error('Error storing OTP:', err);
            return res.status(500).send('Error storing OTP');
        }
        await sendOTPEmail(email, otp);
        res.status(200).send('OTP sent to your email.');
    });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const query = 'SELECT * FROM otps WHERE email = ? AND otp = ?';
    db.query(query, [email, otp], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Invalid or expired OTP.');
        }

        const otpData = results[0];
        if (new Date() > new Date(otpData.expires_at)) {
            return res.status(400).send('Invalid or expired OTP.');
        }

        // Delete OTP after successful verification
        const deleteOtpQuery = 'DELETE FROM otps WHERE email = ?';
        db.query(deleteOtpQuery, [email], (err) => {
            if (err) {
                console.error('Error deleting OTP:', err);
            }
        });

        res.status(200).send('OTP verified successfully.');
    });
};

// Edit Account
exports.editAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, username } = req.body;
    const userId = req.body.userId;

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

// Change Password
exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { oldPassword, newPassword } = req.body;
    const userId = req.body.userId;

    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }
        const user = results[0];
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid old password');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateQuery, [hashedNewPassword, userId], (err) => {
            if (err) {
                console.error('Error changing password:', err);
                return res.status(500).send('Error changing password');
            }

            // Create a notification
            const message = 'Your password has been changed.';
            createNotification(userId, 'password_change', message);

            res.status(200).send('Password changed successfully');
        });
    });
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    const userId = req.body.userId;

    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    db.query(deleteQuery, [userId], (err) => {
        if (err) {
            console.error('Error deleting account:', err);
            return res.status(500).send('Error deleting account');
        }

        // Create a notification
        const message = 'Your account has been deleted.';
        createNotification(userId, 'account_deletion', message);

        res.status(200).send('Account deleted successfully');
    });
};
