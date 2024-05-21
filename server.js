const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 80;

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
