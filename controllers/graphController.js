const db = require('../config/db');

const fetchAllData = (table, callback) => {
    const query = `SELECT value, timestamp FROM ${table} ORDER BY id ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error fetching data from table ${table}:`, err);
            return callback(err);
        }

        if (results.length === 0) {
            console.log(`No data found in ${table} table`);
            return callback(null, []);
        }

        console.log(`Fetched data from ${table} table:`, results);
        callback(null, results);
    });
};

const filterDataByTimeWindow = (data, timeWindow) => {
    if (data.length === 0) return [];

    const endTime = new Date(data[data.length - 1].timestamp);
    let startTime;

    switch (timeWindow) {
        case '1day':
            startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
            break;
        case '1week':
            startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '1month':
            startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            return data;
    }

    console.log(`Filtering data from startTime: ${startTime} to endTime: ${endTime}`);
    return data.filter(item => new Date(item.timestamp) >= startTime && new Date(item.timestamp) <= endTime);
};

const getFilteredData = (req, res, table, timeWindow) => {
    fetchAllData(table, (err, data) => {
        if (err) return res.status(500).send(`Error fetching ${table} data`);

        const filteredData = filterDataByTimeWindow(data, timeWindow);

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

exports.getTempData1Day = (req, res) => getFilteredData(req, res, 'temp', '1day');
exports.getTempData1Week = (req, res) => getFilteredData(req, res, 'temp', '1week');
exports.getTempData1Month = (req, res) => getFilteredData(req, res, 'temp', '1month');

exports.getRhData1Day = (req, res) => getFilteredData(req, res, 'rh', '1day');
exports.getRhData1Week = (req, res) => getFilteredData(req, res, 'rh', '1week');
exports.getRhData1Month = (req, res) => getFilteredData(req, res, 'rh', '1month');

exports.getPressureData1Day = (req, res) => getFilteredData(req, res, 'pressure', '1day');
exports.getPressureData1Week = (req, res) => getFilteredData(req, res, 'pressure', '1week');
exports.getPressureData1Month = (req, res) => getFilteredData(req, res, 'pressure', '1month');

exports.getHumidityData1Day = (req, res) => getFilteredData(req, res, 'humidity', '1day');
exports.getHumidityData1Week = (req, res) => getFilteredData(req, res, 'humidity', '1week');
exports.getHumidityData1Month = (req, res) => getFilteredData(req, res, 'humidity', '1month');
