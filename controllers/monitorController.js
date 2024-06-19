const db = require('../config/db');
const { createNotification } = require('./notificationController');
const socket = require('../socket');

const THRESHOLDS = {
    temp: 35,       // Temperature threshold
    pressure: 1015, // Pressure threshold in hPa
    humidity: 70,   // Humidity threshold in percentage
    rh: 60          // Relative Humidity threshold in percentage
};

exports.checkThresholds = (req, res) => {
    const tables = ['temp', 'pressure', 'humidity', 'rh'];
    let completedRequests = 0;

    tables.forEach((table) => {
        const query = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching latest data from ${table}:`, err);
                return res.status(500).json({ error: `Error fetching latest data from ${table}` });
            } else {
                if (results.length > 0) {
                    const latestData = results[0];
                    const value = latestData.value;
                    const timestamp = latestData.timestamp;

                    console.log(`Latest data from ${table}: Value=${value}, Timestamp=${timestamp}`);

                    if (value > THRESHOLDS[table]) {
                        console.log(`Threshold exceeded in ${table}: Value=${value} > ${THRESHOLDS[table]}`);
                        
                        // Emit the alarm through socket.io
                        const io = socket.getIo();
                        io.emit('alarm', { table, value, timestamp });

                        // Create a notification for threshold breach
                        const userId = req.user ? req.user.id : 1; // Assuming you have user ID from the request, default to 1 if not available
                        const message = `Alert: ${table} value of ${value} exceeded threshold at ${timestamp}`;
                        createNotification(userId, 'threshold_breach', message);
                    } else {
                        console.log(`Value within threshold in ${table}: Value=${value} <= ${THRESHOLDS[table]}`);
                    }
                } else {
                    console.log(`No data found in ${table} table`);
                }
                completedRequests++;
                if (completedRequests === tables.length) {
                    res.status(200).send('Threshold checks completed');
                }
            }
        });
    });
};
