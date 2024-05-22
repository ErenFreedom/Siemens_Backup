const CryptoJS = require('crypto-js');
require('dotenv').config();

// Secret key from .env file
const secretKey = process.env.SECRET_KEY;

// Function to encrypt data
function encryptData(data) {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// Get username and password from command line arguments
const [,, username, password] = process.argv;

if (!username || !password) {
    console.log('Usage: node generateCurlCommands.js <username> <password>');
    process.exit(1);
}

const encryptedPassword = encryptData(password);

// Proxy settings for Burp Suite
const proxy = '--proxy http://127.0.0.1:8080';

// Example curl command for registration
const registerCommand = `curl -X POST https://ec2-3-109-41-79.ap-south-1.compute.amazonaws.com/register \
-H "Content-Type: application/json" \
-d '{"username": "${username}", "password": "${encryptedPassword}"}' \
${proxy} --insecure`;

console.log("Register Command:\n", registerCommand);

// Example curl command for login
const loginCommand = `curl -X POST https://ec2-3-109-41-79.ap-south-1.compute.amazonaws.com/login \
-H "Content-Type: application/json" \
-d '{"username": "${username}", "password": "${encryptedPassword}"}' \
${proxy} --insecure`;

console.log("Login Command:\n", loginCommand);
