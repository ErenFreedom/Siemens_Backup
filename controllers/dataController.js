const db = require('../config/db');

// Controller function to handle data insertion
exports.insertData = (req, res) => {
    const data = req.body;
    console.log('Inserting data:', data); // Debugging statement
    const query = 'INSERT INTO fetched_data (type, value, quality, qualityGood, timestamp, originalObjectOrPropertyId, objectId, propertyName, attributeId, errorCode, isArray) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        data.type,
        data.value,
        data.quality,
        data.qualityGood,
        data.timestamp,
        data.originalObjectOrPropertyId,
        data.objectId,
        data.propertyName,
        data.attributeId,
        data.errorCode,
        data.isArray
    ];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Error inserting data');
        } else {
            console.log('Data inserted successfully into MySQL:', results.insertId);
            res.status(200).send('Data inserted successfully');
        }
    });
};
