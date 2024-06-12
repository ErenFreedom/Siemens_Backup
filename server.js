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
const latestDataRoutes = require('./routes/latestDataRoutes');
const reportRoutes = require('./routes/reportRoutes');
const graphRoutes = require('./routes/graphRoutes');
const accountRoutes = require('./routes/accountRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

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
app.use('/api', dataRoutes); // Ensure this is protected with token verification
app.use(loggerRoutes);
app.use('/api', latestDataRoutes); // Adding the new route for latest data
app.use('/api', reportRoutes); // Adding the new route for report generation
app.use('/api', graphRoutes); // Adding the new route for graph data
app.use('/api', accountRoutes); // Adding the new route for account management
app.use('/api', notificationRoutes); // Adding the new route for notifications

// Load SSL/TLS certificates
const options = {
    key: fs.readFileSync('./key.pem'), 
    cert: fs.readFileSync('./cert.pem') 
};

// Create HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
