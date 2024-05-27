const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 443; // Ensure the port is set to 443 for HTTPS

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const loggerRoutes = require('./routes/loggerRoutes');

app.use(bodyParser.json());
app.use(helmet());

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use(authRoutes);
app.use(dataRoutes);
app.use(loggerRoutes);

// Load SSL/TLS certificates
const options = {
    key: fs.readFileSync('./key.pem'), 
    cert: fs.readFileSync('./cert.pem') 
};

// Create HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
