// controllers/monitorController.js
const db = require('../config/db');

const THRESHOLDS = {
    temp: 35,
    pressure: 1015,
    humidity: 70,
    rh: 60
};

exports.checkThresholds = (req, res) => {
    const tables = ['temp', 'pressure', 'humidity', 'rh'];
    const notifications = [];
    let completedRequests = 0;

    tables.forEach((table) => {
        const query = `SELECT * FROM ${table}`;
        const threshold = THRESHOLDS[table];

        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching data from ${table}:`, err);
                return res.status(500).json({ error: `Error fetching data from ${table}` });
            } else {
                results.forEach(row => {
                    if (row.value > threshold) {
                        notifications.push({
                            table,
                            value: row.value,
                            timestamp: row.timestamp,
                            message: `Alert: ${table} value of ${row.value} exceeded threshold at ${row.timestamp}`
                        });
                    }
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
