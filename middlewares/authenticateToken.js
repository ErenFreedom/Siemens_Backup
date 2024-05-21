const jwt=require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const authenticationToken = (req, res, next) => {
    const authHeader = req.header['authorization'];
    const token = authheader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = authenticationToken;