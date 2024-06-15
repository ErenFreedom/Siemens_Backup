const db = require('../config/db');
const { createNotification } = require('./notificationController');
const io = require('../server');

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
                return res.status(500).json({ error: `Error fetching latest data from ${table}` });
            } else {
                if (results.length === 0) {
                    console.warn(`No data found in ${table}`);
                    latestData[table] = {
                        value: null,
                        timestamp: null
                    };
                } else {
                    console.log(`Data fetched from ${table}:`, results); // Log the data
                    latestData[table] = {
                        value: results[0].value,
                        timestamp: results[0].timestamp
                    };
                }
                completedRequests++;
                if (completedRequests === tables.length) {
                    console.log('Latest data to send:', latestData); // Log the final data being sent
                    return res.status(200).json(latestData);
                }

                // Emit the new data through socket.io
                io.emit('data_update', { table, data: latestData[table] });

                // Create a notification for new data insertion
                const userId = req.user ? req.user.id : null; // Assuming you have user ID from the request
                const message = `New data added to ${table} table.`;
                if (userId) {
                    createNotification(userId, 'data_update', message);
                }
            }
        });
    });
};
