const express = require('express');
const router = express.Router();

const GenerateOffer = require('../models/generateOffer');

router.post('/', (req, res, next) => {
    GenerateOffer.findById(req.body.id)
        .then((result) => {
            if (result == null) {
                res.status(404).json({
                    message: 'not found'
                });
            }
            console.log(result);
            if (result.typeOf == 'Category') {
                result.list.push(req.body.form.category);
            }
            else if (result.typeOf == 'Product') {
                result.list.push(req.body.form.product);
            }
            result.save()
                .then((result) => {
                    res.status(201).json({
                        message: 'success'
                    });
                });
        })
        .catch(() => {
            res.status(500).json({
                message: 'server error'
            })
        });
})

router.put('/:id', (req, res, next) => {
    console.log(req.body.id);
    GenerateOffer.findById(req.params.id)
        .then((result) => {
            let count = 0;
            console.log(result.list);
            result.list = result.list.filter((item) => {
                if (item != req.body.id || count == 1) {
                    return item;
                }
                else if (item == req.body.id) {
                    count = 1;
                }
            })
            result.save()
                .then(() => {
                    res.status(200).json({
                        message: 'success'
                    });
            })
        })
})

module.exports = router;