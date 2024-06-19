// controllers/monitorController.js
const db = require('../config/db');
const socket = require('../socket');

const THRESHOLDS = {
    temp: 35,       // Temperature threshold
    pressure: 1015, // Pressure threshold in hPa
    humidity: 70,   // Humidity threshold in percentage
    rh: 60          // Relative Humidity threshold in percentage
};

const checkThresholds = () => {
    const tables = ['temp', 'pressure', 'humidity', 'rh'];
    
    tables.forEach((table) => {
        const query = `SELECT * FROM ${table}`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching data from ${table}:`, err);
                return;
            }

            results.forEach((data) => {
                const { value, timestamp } = data;
                if (value > THRESHOLDS[table]) {
                    console.log(`Threshold exceeded in ${table}: Value=${value} > ${THRESHOLDS[table]}`);
                    
                    // Emit the alarm through socket.io
                    const io = socket.getIo();
                    io.emit('alarm', { table, value, timestamp });

                    // Insert a notification for threshold breach
                    const userId = 1; // Assuming user ID 1 for simplicity
                    const message = `Alert: ${table} value of ${value} exceeded threshold at ${timestamp}`;
                    const notificationQuery = `INSERT INTO notifications (user_id, message) VALUES ($1, $2)`;
                    db.query(notificationQuery, [userId, message], (notificationErr) => {
                        if (notificationErr) {
                            console.error('Error inserting notification:', notificationErr);
                        } else {
                            console.log('Notification inserted successfully');
                        }
                    });
                }
            });
        });
    });
};

const clearNotifications = (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from the request
    const query = `DELETE FROM notifications WHERE user_id = $1`;
    db.query(query, [userId], (err) => {
        if (err) {
            console.error('Error clearing notifications:', err);
            return res.status(500).json({ error: 'Error clearing notifications' });
        }
        res.status(200).json({ message: 'Notifications cleared successfully' });
    });
};

module.exports = { checkThresholds, clearNotifications };
