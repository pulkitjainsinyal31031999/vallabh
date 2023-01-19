const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.api_key;
        jwt.verify(token, 'fkjnveefve');
        next();
    }
    catch (error) {
        res.status(401).json({message: 'not authorize!'});
    }
}