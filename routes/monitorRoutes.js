const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

// Existing routes...

router.get('/notifications', (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from the request
    const query = `SELECT * FROM notifications WHERE user_id = $1 ORDER BY timestamp DESC`;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ error: 'Error fetching notifications' });
        }
        res.json(results.rows);
    });
});

module.exports = router;
