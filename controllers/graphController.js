const db = require('../config/db');
const { sub, formatISO } = require('date-fns');

// Function to get the starting timestamp based on the filter
const getStartTime = (filter) => {
    const now = new Date();
    switch (filter) {
        case '30min':
            return formatISO(sub(now, { minutes: 30 }));
        case '1hour':
            return formatISO(sub(now, { hours: 1 }));
        case '6hours':
            return formatISO(sub(now, { hours: 6 }));
        case '1day':
            return formatISO(sub(now, { days: 1 }));
        case '1week':
            return formatISO(sub(now, { weeks: 1 }));
        case '1month':
            return formatISO(sub(now, { months: 1 }));
        default:
            return formatISO(now);
    }
};

// Function to get data and metrics based on the filter
const getDataAndMetrics = (table, filter, callback) => {
    const startTime = getStartTime(filter).slice(0, 19).replace('T', ' ');
    const query = `SELECT * FROM ${table} WHERE timestamp >= ? ORDER BY timestamp ASC`;

    console.log(`Executing query: ${query} with startTime: '${startTime}'`);

    db.query(query, [startTime], (err, results) => {
        if (err) {
            console.error(`Error fetching data from table ${table}:`, err);
            return callback(err);
        }

        console.log(`Query results: ${results.length} rows`);

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

        console.log(`Metrics: ${JSON.stringify(metrics)}`);

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
