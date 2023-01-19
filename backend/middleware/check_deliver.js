const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.api_key;
        jwt.verify(token, 'oindvoiwenrrv');
        next();
    }
    catch(err) {
        res.status(401).json({
            message: 'You are Not Authorize'
        })
    }
}