const CryptoJS = require('crypto-js');
require('dotenv').config();

// Secret key from .env file
const secretKey = process.env.SECRET_KEY;

// Function to encrypt data
function encryptData(data) {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// Get email, username, and password from command line arguments
const [,, email, username, password] = process.argv;

if (!email || !username || !password) {
    console.log('Usage: node generateCurlCommands.js <email> <username> <password>');
    process.exit(1);
}

const encryptedPassword = encryptData(password);

// Example curl command for registration
const registerCommand = `curl -X POST https://ec2-3-109-41-79.ap-south-1.compute.amazonaws.com/register \
-H "Content-Type: application/json" \
-d '{"email": "${email}", "username": "${username}", "password": "${encryptedPassword}"}' \
--insecure`;

console.log("Register Command:\n", registerCommand);

// Example curl command for login (with email)
const loginCommandEmail = `curl -X POST https://ec2-3-109-41-79.ap-south-1.compute.amazonaws.com/login \
-H "Content-Type: application/json" \
-d '{"email": "${email}", "password": "${encryptedPassword}"}' \
--insecure`;

console.log("Login Command (with email):\n", loginCommandEmail);

// Example curl command for login (with username)
const loginCommandUsername = `curl -X POST https://ec2-3-109-41-79.ap-south-1.compute.amazonaws.com/login \
-H "Content-Type: application/json" \
-d '{"username": "${username}", "password": "${encryptedPassword}"}' \
--insecure`;

console.log("Login Command (with username):\n", loginCommandUsername);
