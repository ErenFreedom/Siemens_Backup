const db = require('../config/db');
const moment = require('moment'); // Ensure moment is installed using npm install moment

const getStartTime = (filter) => {
    const now = moment();
    switch (filter) {
        case '30min':
            return now.subtract(30, 'minutes');
        case '1hour':
            return now.subtract(1, 'hours');
        case '6hours':
            return now.subtract(6, 'hours');
        case '1day':
            return now.subtract(1, 'days');
        case '1week':
            return now.subtract(1, 'weeks');
        case '1month':
            return now.subtract(1, 'months');
        default:
            return now;
    }
};

const getDataAndMetrics = (callback) => {
    const query = `SELECT value, timestamp FROM temp ORDER BY id ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error fetching data from table temp:`, err);
            return callback(err);
        }

        if (results.length === 0) {
            return callback(null, { data: [], metrics: {} });
        }

        const data = results.map(row => ({
            value: row.value,
            timestamp: row.timestamp
        }));

        callback(null, data);
    });
};

exports.getTempData = (req, res) => {
    const { filter } = req.params;
    const startTime = getStartTime(filter);

    getDataAndMetrics((err, data) => {
        if (err) return res.status(500).send('Error fetching temperature data');

        // Filter data based on the start time
        const filteredData = data.filter(row => moment(row.timestamp).isAfter(startTime));

        if (filteredData.length === 0) {
            return res.json({ data: [], metrics: {} });
        }

        const values = filteredData.map(row => row.value);
        const sum = values.reduce((a, b) => a + b, 0);
        const average = (sum / values.length).toFixed(2);
        const max = Math.max(...values).toFixed(2);
        const min = Math.min(...values).toFixed(2);
        const range = (max - min).toFixed(2);
        const variance = (values.reduce((a, b) => a + Math.pow(b - average, 2), 0) / values.length).toFixed(2);
        const stddev = Math.sqrt(variance).toFixed(2);

        const metrics = {
            average,
            max,
            min,
            range,
            variance,
            stddev
        };

        res.json({ data: filteredData, metrics });
    });
};
