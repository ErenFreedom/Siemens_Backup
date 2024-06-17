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

exports.getTempData = (req, res) => {
    fetchData((err, data) => {
        if (err) return res.status(500).send('Error fetching temperature data');
        res.json(data);
    });
};
