// monitorController.js
const db = require('../config/db');
const { createNotification } = require('./notificationController');
const socket = require('../socket');

const thresholds = {
    temp: 35,
    pressure: 1013,
    humidity: 70,
    rh: 60
};

const checkThresholds = async () => {
    const tables = ['temp', 'pressure', 'humidity', 'rh'];

    tables.forEach((table) => {
        const query = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`;
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching latest data from MySQL table ${table}:`, err);
                return;
            } else {
                if (results.length > 0) {
                    const value = results[0].value;
                    const timestamp = results[0].timestamp;

                    if (value > thresholds[table]) {
                        // Emit the new data through socket.io
                        const io = socket.getIo();
                        io.emit('alarm', { table, value, timestamp });

                        // Create a notification for exceeding threshold
                        const userId = 1; // Replace with actual user ID
                        const message = `Alarm: ${table} value of ${value} exceeded threshold at ${timestamp}`;
                        createNotification(userId, 'threshold_exceeded', message);

                        console.log(`Alarm: ${table} value of ${value} exceeded threshold at ${timestamp}`);
                    }
                }
            }
        });
    });
};

exports.monitorThresholds = (req, res) => {
    checkThresholds();
    res.status(200).send('Monitoring thresholds...');
};
