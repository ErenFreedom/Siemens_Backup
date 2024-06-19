const db = require('../config/db');
const { createNotification } = require('./notificationController');
const socket = require('../socket');

const THRESHOLDS = {
    temp: 35,       // Temperature threshold
    pressure: 1015, // Pressure threshold in hPa
    humidity: 70,   // Humidity threshold in percentage
    rh: 60          // Relative Humidity threshold in percentage
};

let lastCheckedIds = {
    temp: 0,
    pressure: 0,
    humidity: 0,
    rh: 0
};

const checkThresholds = () => {
    const tables = ['temp', 'pressure', 'humidity', 'rh'];

    tables.forEach((table) => {
        const query = `SELECT * FROM ${table} WHERE id > ? ORDER BY id ASC`;
        db.query(query, [lastCheckedIds[table]], (err, results) => {
            if (err) {
                console.error(`Error fetching latest data from ${table}:`, err);
                return;
            }

            results.forEach((data) => {
                const value = data.value;
                const timestamp = data.timestamp;

                if (value > THRESHOLDS[table]) {
                    console.log(`Threshold exceeded in ${table}: Value=${value} > ${THRESHOLDS[table]}`);

                    // Emit the alarm through socket.io
                    const io = socket.getIo();
                    io.emit('alarm', { table, value, timestamp });

                    // Create a notification for threshold breach
                    const userId = 1; // Assuming a single user or use a default user ID
                    const message = `Alert: ${table} value of ${value} exceeded threshold at ${timestamp}`;
                    createNotification(userId, 'threshold_breach', message);
                }
            });

            if (results.length > 0) {
                lastCheckedIds[table] = results[results.length - 1].id;
            }
        });
    });
};

// Run the checkThresholds function every 30 seconds
setInterval(checkThresholds, 30000);

exports.checkThresholds = (req, res) => {
    res.status(200).send('Threshold monitoring is active');
};
