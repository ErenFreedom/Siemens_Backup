const db = require('../config/db');
const bcrypt = require('bcrypt');

// Logout user
exports.logout = (req, res) => {
    // Simply clear the token on the client-side to logout
    res.status(200).send('Logout successful');
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.userId;

    const query = 'SELECT password FROM users WHERE id = ?';
    db.query(query, [userId], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found.');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Incorrect password.');
        }

        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error deleting account:', err);
                return res.status(500).send('Error deleting account');
            }

            res.status(200).send('Account deleted successfully');
        });
    });
};
