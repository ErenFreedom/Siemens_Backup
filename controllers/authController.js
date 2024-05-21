const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [username], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).send('Error checking user');
        }

        if (results.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send('Error registering user');
            }
            res.send('User registered successfully');
        });
    });
};

exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
};
