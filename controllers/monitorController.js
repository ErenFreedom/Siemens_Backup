// controllers/monitorController.js
const db = require('../config/db');

exports.fetchNotifications = (req, res) => {
    const tables = ['temp', 'pressure', 'humidity', 'rh'];
    const notifications = [];
    let completedRequests = 0;

    tables.forEach((table) => {
        const query = `SELECT * FROM ${table} WHERE value > ? ORDER BY timestamp DESC`;
        const threshold = {
            temp: 35,
            pressure: 1015,
            humidity: 70,
            rh: 60
        }[table];

        db.query(query, [threshold], (err, results) => {
            if (err) {
                console.error(`Error fetching data from ${table}:`, err);
                return res.status(500).json({ error: `Error fetching data from ${table}` });
            } else {
                results.forEach(row => {
                    notifications.push({
                        table,
                        value: row.value,
                        timestamp: row.timestamp,
                        message: `Alert: ${table} value of ${row.value} exceeded threshold at ${row.timestamp}`
                    });
                });

                completedRequests++;
                if (completedRequests === tables.length) {
                    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    res.json(notifications);
                }
            }
        });
    });
};
