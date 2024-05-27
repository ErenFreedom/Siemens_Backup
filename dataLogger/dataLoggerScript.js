const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config();

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = process.env;

// MySQL connection
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
});

const token = process.argv[2];

if (!token) {
    console.error('Token is required');
    process.exit(1);
}

const getAuthToken = async () => {
    try {
        const response = await axios.post('https://192.168.22.160/WebServiceApplication/api/token', 
        'grant_type=password&username=defaultadmin&password=desigo', 
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching auth token:', error);
        process.exit(1);
    }
};

const logData = async (authToken) => {
    try {
        const response = await axios.get('https://192.168.22.160:443/WebServiceApplication/api/values/System1.LogicalView:LogicalView.BACNETNETWORK.B.F1.SA1.plant.T;.Present_Value', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        const data = response.data;

        const logEntry = {
            data_type: data.DataType,
            value: parseFloat(data.Value.Value),
            quality: data.Value.Quality,
            quality_good: data.Value.QualityGood,
            timestamp: new Date(data.Value.Timestamp),
            original_object_or_property_id: data.OriginalObjectOrPropertyId,
            object_id: data.ObjectId,
            property_name: data.PropertyName,
            attribute_id: data.AttributeId,
            error_code: data.ErrorCode,
            is_array: data.IsArray,
        };

        db.query('INSERT INTO temperature_logs SET ?', logEntry, (err, res) => {
            if (err) {
                console.error('Error inserting data into the database:', err);
            } else {
                console.log('Data logged successfully at', new Date().toISOString());
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const startLogging = async (interval) => {
    const authToken = await getAuthToken();
    setInterval(() => logData(authToken), interval);
};

console.log('Starting data logging...');
startLogging(30000); // Log data every 30 seconds
