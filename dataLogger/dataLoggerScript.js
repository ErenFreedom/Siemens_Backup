const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config();

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the database');
});

// Function to log data to the database
async function logData(token) {
    try {
        const response = await axios.get('https://192.168.22.160:443/WebServiceApplication/api/values/System1.LogicalView:LogicalView.BACNETNETWORK.B.F1.SA1.plant.AQualR;.Present_Value', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });

        const data = response.data;
        console.log('Data fetched:', data);

        const query = 'INSERT INTO temperature_logs (data_type, value, quality, quality_good, timestamp, original_object_or_property_id, object_id, property_name, attribute_id, error_code, is_array) VALUES ?';
        const values = data.map(item => [
            item.DataType,
            parseFloat(item.Value.Value),
            item.Value.Quality,
            item.Value.QualityGood,
            new Date(item.Value.Timestamp),
            item.OriginalObjectOrPropertyId,
            item.ObjectId,
            item.PropertyName,
            item.AttributeId,
            item.ErrorCode,
            item.IsArray
        ]);

        db.query(query, [values], (err, results) => {
            if (err) {
                console.error('Error inserting data into the database:', err);
                return;
            }
            console.log('Data inserted into the database:', results);
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

// Main function to run the data logging
async function main() {
    const token = process.argv[2];
    if (!token) {
        console.log('Usage: node dataLoggerScript.js <JWT_TOKEN>');
        process.exit(1);
    }

    console.log('Starting data logging...');
    setInterval(() => logData(token), 30000); // Log data every 30 seconds
}

main();
