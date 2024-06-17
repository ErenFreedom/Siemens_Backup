const db = require('../config/db');
const moment = require('moment'); // Importing moment library

const getStartTime = (filter) => {
    const now = moment();
    switch (filter) {
        case '30min':
            return now.subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        case '1hour':
            return now.subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
        case '6hours':
            return now.subtract(6, 'hours').format('YYYY-MM-DD HH:mm:ss');
        case '1day':
            return now.subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
        case '1week':
            return now.subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss');
        case '1month':
            return now.subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
        default:
            return now.format('YYYY-MM-DD HH:mm:ss');
    }
};

const getDataAndMetrics = (table, filter, callback) => {
    const startTime = getStartTime(filter);
    const query = `SELECT * FROM ${table} WHERE timestamp >= ? ORDER BY timestamp ASC`;

    db.query(query, [startTime], (err, results) => {
        if (err) {
            console.error(`Error fetching data from table ${table}:`, err);
            return callback(err);
        }

        if (results.length === 0) {
            return callback(null, { data: [], metrics: {} });
        }

        const data = results.map(row => ({
            ...row,
            formattedTimestamp: moment(row.timestamp).format('YYYY-MM-DD HH:mm:ss') // Formatting to user-friendly date
        }));

        const values = data.map(row => row.value);
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

        callback(null, { data, metrics });
    });
};

exports.getTempData = (req, res) => {
    const { filter } = req.params;
    console.log(`Fetching temperature data with filter: ${filter}`);
    getDataAndMetrics('temp', filter, (err, result) => {
        if (err) return res.status(500).send('Error fetching temperature data');
        res.json(result);
    });
};
