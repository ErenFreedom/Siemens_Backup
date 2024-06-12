const db = require('../config/db');
const { createNotification } = require('./notificationController');

// Controller function to get the latest data from all tables
exports.getLatestData = (req, res) => {
    const tables = ['temp', 'pressure', 'humidity', 'rh'];
    let latestData = {};
    let completedRequests = 0;

    tables.forEach((table) => {
        const query = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching latest data from MySQL table ${table}:`, err);
                return res.status(500).send(`Error fetching latest data from ${table}`);
            } else {
                latestData[table] = results[0];
                completedRequests++;
                if (completedRequests === tables.length) {
                    res.status(200).json(latestData);
                }

                // Create a notification for new data insertion
                const userId = req.user.id; // Assuming you have user ID from the request
                const message = `New data added to ${table} table.`;
                createNotification(userId, 'data_update', message);
            }
        });
    });
};
