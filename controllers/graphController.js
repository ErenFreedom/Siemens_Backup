const db = require('../config/db');

const getStartId = (table, filter, callback) => {
    const now = new Date();
    let startTime;
    switch (filter) {
        case '30min':
            startTime = new Date(now.getTime() - 30 * 60 * 1000);
            break;
        case '1hour':
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
        case '6hours':
            startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            break;
        case '1day':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case '1week':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '1month':
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            startTime = now;
    }

    startTime = startTime.toISOString().slice(0, 19).replace('T', ' ');

    const query = `SELECT id FROM ${table} WHERE timestamp >= ? ORDER BY id ASC LIMIT 1`;

    db.query(query, [startTime], (err, results) => {
        if (err) {
            console.error(`Error fetching start ID from table ${table}:`, err);
            return callback(err);
        }
        const startId = results.length > 0 ? results[0].id : 0;
        callback(null, startId);
    });
};

const getDataAndMetrics = (table, filter, callback) => {
    getStartId(table, filter, (err, startId) => {
        if (err) return callback(err);

        const query = `SELECT * FROM ${table} WHERE id >= ? ORDER BY id ASC`;

        console.log(`Executing query: ${query} with startId: ${startId}`);

        db.query(query, [startId], (err, results) => {
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
