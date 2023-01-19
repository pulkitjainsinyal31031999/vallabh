const express = require('express');
const router = express.Router();

router.post('/purchase', (req, res, next) => {
    console.log('hello');
    res.status(201);
})

module.exports = router;