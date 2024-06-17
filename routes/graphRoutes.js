const db = require('../config/db');

const fetchData = (callback) => {
    const query = `SELECT value, timestamp FROM temp ORDER BY id ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error fetching data from table temp:`, err);
            return callback(err);
        }

        if (results.length === 0) {
            console.log('No data found in temp table');
            return callback(null, []);
        }

        console.log(`Fetched data from temp table:`, results);
        callback(null, results);
    });
};

const filterData = (data, timeWindow) => {
    const now = new Date();
    let startTime;

    switch (timeWindow) {
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
            return data;
    }

    console.log(`Filtering data from startTime: ${startTime}`);
    return data.filter(item => new Date(item.timestamp) >= startTime);
};

const getFilteredData = (req, res, timeWindow) => {
    fetchData((err, data) => {
        if (err) return res.status(500).send('Error fetching temperature data');

        const filteredData = filterData(data, timeWindow);

        const values = filteredData.map(item => item.value);
        if (values.length === 0) {
            return res.json({
                data: [],
                metrics: {
                    average: 'NaN',
                    max: '-Infinity',
                    min: 'Infinity',
                    range: '-Infinity',
                    variance: 'NaN',
                    stddev: 'NaN'
                }
            });
        }

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

exports.getTempData30Min = (req, res) => getFilteredData(req, res, '30min');
exports.getTempData1Hour = (req, res) => getFilteredData(req, res, '1hour');
exports.getTempData6Hours = (req, res) => getFilteredData(req, res, '6hours');
exports.getTempData1Day = (req, res) => getFilteredData(req, res, '1day');
exports.getTempData1Week = (req, res) => getFilteredData(req, res, '1week');
exports.getTempData1Month = (req, res) => getFilteredData(req, res, '1month');
