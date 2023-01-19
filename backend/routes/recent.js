const express = require('express');
const check_in = require('../middleware/check_in');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/view', check_in, (req, res, next) => {
    User.findById(jwt.decode(req.headers.api_key).id) 
        .then((result) => {
            if (result === null) {
                res.status(400);
            }
            else {
                if (result.recentlyViewed.length === 0) {
                    result.recentlyViewed.push({ id: req.body.id, timeStamp: new Date() });
                }
                else {
                    result.recentlyViewed = result.recentlyViewed.filter(element => {
                        if (element.id != req.body.id) {
                            return element;
                        }
                    });
                    result.recentlyViewed.push({ id: req.body.id, timeStamp: new Date() });
                }
                result.save();
                res.status(200);
            }
        })
});


router.post('recentlySearch', (req, res, next) => {
});

module.exports = router;