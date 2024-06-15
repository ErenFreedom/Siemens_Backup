const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const io = socketIo(server);

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
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', dataRoutes);
app.use(loggerRoutes);
app.use('/api', latestDataRoutes);
app.use('/api', reportRoutes);
app.use('/api', graphRoutes);
app.use('/api', accountRoutes);
app.use('/api', notificationRoutes);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Export io for other modules
module.exports = { io };

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
