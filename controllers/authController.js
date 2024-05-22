const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Function to decrypt data
function decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Decrypt the password
    const decryptedPassword = decryptData(password);

    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [username], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).send('Error checking user');
        }

        if (results.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
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

    // Decrypt the password
    const decryptedPassword = decryptData(password);

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }
        const user = results[0];
        const validPassword = await bcrypt.compare(decryptedPassword, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
};
