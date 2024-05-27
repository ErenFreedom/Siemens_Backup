const axios = require('axios');
require('dotenv').config();

const token = process.argv[2]; // Pass the token as a command-line argument
if (!token) {
    console.log('Usage: node dataLoggerScript.js <JWT_TOKEN>');
    process.exit(1);
}

const url = 'https://192.168.22.160:443/WebServiceApplication/api/values/System1.LogicalView:LogicalView.BACNETNETWORK.B.F1.SA1.plant.T;.Present_Value';

const logData = async () => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const startLogging = (interval) => {
    console.log(`Started logging data every ${interval / 1000} seconds.`);
    setInterval(logData, interval);
};

startLogging(30000); // Log data every 30 seconds
