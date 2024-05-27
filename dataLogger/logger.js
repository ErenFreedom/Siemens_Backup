const axios = require('axios');
const fs = require('fs');
const path = require('path');

let isLogging = false;
let intervalId;

const logData = async () => {
    try {
        const response = await axios.get('https://192.168.22.160:443/WebServiceApplication/api/values/System1.LogicalView:LogicalView.BACNETNETWORK.B.F1.SA1.plant.T;.Present_Value');
        const data = response.data;

        // Log the data with a timestamp
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp}: ${JSON.stringify(data)}\n`;

        fs.appendFileSync(path.join(__dirname, 'dataLog.txt'), logEntry);
        console.log(`Logged data at ${timestamp}`);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const startLogging = (interval) => {
    if (isLogging) {
        console.log('Logging is already in progress.');
        return;
    }

    isLogging = true;
    intervalId = setInterval(logData, interval);
    console.log('Started logging data.');
};

const stopLogging = () => {
    if (!isLogging) {
        console.log('Logging is not in progress.');
        return;
    }

    clearInterval(intervalId);
    isLogging = false;
    console.log('Stopped logging data.');
};

module.exports = { startLogging, stopLogging };
