const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const db = require('../config/db');

// Existing routes...

router.get('/notifications', (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from the request
    const query = `SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC`;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ error: 'Error fetching notifications' });
        }
        res.json(results);
    });
});

router.delete('/notifications', monitorController.clearNotifications);

module.exports = router;
