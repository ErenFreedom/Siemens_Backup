const db = require('../config/db');
const moment = require('moment');

const getStartTime = (filter) => {
    const now = moment();
    switch (filter) {
        case '30min':
            return now.subtract(30, 'minutes').toISOString();
        case '1hour':
            return now.subtract(1, 'hours').toISOString();
        case '6hours':
            return now.subtract(6, 'hours').toISOString();
        case '1day':
            return now.subtract(1, 'days').toISOString();
        case '1week':
            return now.subtract(1, 'weeks').toISOString();
        case '1month':
            return now.subtract(1, 'months').toISOString();
        default:
            return now.toISOString();
    }
};

const getDataAndMetrics = (filter, callback) => {
    const query = `SELECT value, timestamp FROM temp ORDER BY id ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error fetching data from table temp:`, err);
            return callback(err);
        }

        if (results.length === 0) {
            console.log('No data found in temp table');
            return callback(null, { data: [], metrics: {} });
        }

        const startTime = moment(getStartTime(filter));
        const filteredData = results.filter(row => moment(row.timestamp).isAfter(startTime));

        if (filteredData.length === 0) {
            console.log('No data found for the specified filter:', filter);
            return callback(null, { data: [], metrics: {} });
        }

        console.log(`Filtered data for filter ${filter}:`, filteredData);

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

        callback(null, { data: filteredData, metrics });
    });
};

exports.getTempData = (req, res) => {
    const { filter } = req.params;

    getDataAndMetrics(filter, (err, result) => {
        if (err) return res.status(500).send('Error fetching temperature data');
        res.json(result);
    });
};
