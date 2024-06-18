const db = require('../config/db');
const bcrypt = require('bcrypt');
const { generateOTP, sendOTPEmail } = require('../utils/otpGeneration');

// Logout user
exports.logout = (req, res) => {
    res.status(200).send('Logout successful');
};

// Generate OTP for account deletion
exports.generateDeleteAccountOTP = async (req, res) => {
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

// Verify OTP and delete account
exports.verifyDeleteAccountOTP = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user.userId;

    const query = 'SELECT email FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found.');
        }

        const email = results[0].email;
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

            const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
            db.query(deleteUserQuery, [userId], (err) => {
                if (err) {
                    console.error('Error deleting account:', err);
                    return res.status(500).send('Error deleting account');
                }

                const deleteOtpQuery = 'DELETE FROM otps WHERE email = ?';
                db.query(deleteOtpQuery, [email], (err) => {
                    if (err) {
                        console.error('Error deleting OTP:', err);
                    }
                });

                res.status(200).send('Account deleted successfully');
            });
        });
    });
};
