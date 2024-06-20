const db = require('../config/db');

// Helper function to insert data into a specific table
const insertDataIntoTable = (table, data, res) => {
    const query = `INSERT INTO ${table} (type, value, quality, qualityGood, timestamp, originalObjectOrPropertyId, objectId, propertyName, attributeId, errorCode, isArray) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
            console.error(`Error inserting data into MySQL table ${table}:`, err);
            res.status(500).send(`Error inserting data into ${table}`);
        } else {
            console.log(`Data inserted successfully into MySQL table ${table}:`, results.insertId);
            res.status(200).send(`Data inserted successfully into ${table}`);
        }
    });
};

// Controller function to handle data insertion into temp table
exports.insertTempData = (req, res) => {
    const data = req.body;
    console.log('Inserting data into temp:', data); // Debugging statement
    insertDataIntoTable('temp', data, res);
};

// Controller function to handle data insertion into rh table
exports.insertRhData = (req, res) => {
    const data = req.body;
    console.log('Inserting data into rh:', data); // Debugging statement
    insertDataIntoTable('rh', data, res);
};
