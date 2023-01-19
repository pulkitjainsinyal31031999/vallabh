const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.apikey;
        jwt.verify(token, 'weierfjjviuwb');
        next();
    }
    catch {
        res.status(401);
    }
}