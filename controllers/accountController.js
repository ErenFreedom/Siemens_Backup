const db = require('../config/db');
const bcrypt = require('bcrypt');

// Logout user
exports.logout = (req, res) => {
    res.status(200).send('Logout successful');
};

// Generate OTP
exports.generateOTP = async (req, res) => {
    const userId = req.user.userId;
    const query = 'SELECT email FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found.');
        }
        const email = results[0].email;
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

        const insertOtpQuery = 'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)';
        db.query(insertOtpQuery, [email, otp, expiresAt], async (err) => {
            if (err) {
                console.error('Error storing OTP:', err);
                return res.status(500).send('Error storing OTP');
            }
            console.log(`OTP ${otp} stored for email ${email}`);
            // Send OTP email logic (implement sendOTPEmail function)
            res.status(200).send('OTP sent to your email.');
        });
    });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
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
            const deleteOtpQuery = 'DELETE FROM otps WHERE email = ?';
            db.query(deleteOtpQuery, [email], (err) => {
                if (err) {
                    console.error('Error deleting OTP:', err);
                }
            });
            res.status(200).json({ email });
        });
    });
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    const userId = req.user.userId;
    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    db.query(deleteQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting account:', err);
            return res.status(500).send('Error deleting account');
        }
        res.status(200).send('Account deleted successfully');
    });
};
