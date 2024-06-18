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

            res.status(200).json({ email, username });
        });
    });
};

// Edit Account
// Edit Account
// Edit Account
exports.editAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { newPassword } = req.body;
    const userId = req.user.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Begin transaction
    db.beginTransaction(err => {
        if (err) {
            console.error('Transaction error:', err);
            return res.status(500).send('Transaction error');
        }

        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteQuery, [userId], (err) => {
            if (err) {
                console.error('Error deleting user:', err);
                return db.rollback(() => {
                    res.status(500).send('Error deleting user');
                });
            }

            const selectQuery = 'SELECT email, username FROM users WHERE id = ?';
            db.query(selectQuery, [userId], (err, results) => {
                if (err || results.length === 0) {
                    return db.rollback(() => {
                        res.status(500).send('Error fetching user details');
                    });
                }

                const user = results[0];
                const insertQuery = 'INSERT INTO users (id, email, username, password) VALUES (?, ?, ?, ?)';
                db.query(insertQuery, [userId, user.email, user.username, hashedPassword], (err) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        return db.rollback(() => {
                            res.status(500).send('Error inserting user');
                        });
                    }

                    // Commit transaction
                    db.commit(err => {
                        if (err) {
                            console.error('Transaction commit error:', err);
                            return db.rollback(() => {
                                res.status(500).send('Transaction commit error');
                            });
                        }

                        // Create a notification
                        const message = 'Your account password has been updated.';
                        createNotification(userId, 'account_update', message);

                        res.status(200).send('Account updated successfully');
                    });
                });
            });
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
