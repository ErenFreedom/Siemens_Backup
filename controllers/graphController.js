const db = require('../config/db');

const getStartTime = (filter) => {
    const now = new Date();
    switch (filter) {
        case '30min':
            return new Date(now.getTime() - 30 * 60 * 1000).toISOString();
        case '1hour':
            return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        case '6hours':
            return new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
        case '1day':
            return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        case '1week':
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        case '1month':
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        default:
            return now.toISOString();
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

        const data = results;
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
    getDataAndMetrics('temp', filter, (err, result) => {
        if (err) return res.status(500).send('Error fetching temperature data');
        res.json(result);
    });
};
