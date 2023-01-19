const express = require('express');
const router = express.Router();

const GenerateOffer = require('../models/generateOffer');

router.get('/all', (req, res, next) => {
    GenerateOffer.find()
        .populate('list')
            .then((result) => {
                console.log(result);
                res.status(200).json({
                result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'server error'
            })
        })
})

router.get('/all/:id', (req, res, next) => {
    GenerateOffer.find()
//        .populate({path: 'list'})
        .populate({match: { typeOf: 'Product' }, path: 'list'})
        .skip(req.params.id)
        .limit(2)
        .then((result) => {
            let count1;
            if(result == null) {
            }
            else {
                result.forEach((item) => {
                    if(item.typeOf == 'Product') {
                        item.list.forEach((product) => {
                            product = product.populate('addOns');
                        })
                    }
                })
            }
            GenerateOffer.countDocuments((err, count) => {
                count1 = count;
                res.status(200).json({
                    result,
                    count: count1
                });
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                message: 'server error'
            })
        })
})

router.post('/', (req, res, next) => {
    const generateOffer = new GenerateOffer({
        title: req.body.title,
        typeOf: req.body.typeOf
    });

    generateOffer.save()
        .then((result) => {
            res.status(201).json({
                message: 'success'
            })
        })
        .catch(() => {
            res.status(500).json({
                message: 'server error'
            })
        })
})

router.put('/:id', (req, res, next) => {
    const generateOffer = new GenerateOffer({
        _id: req.params.id,
        title: req.body.title,
        typeOf: req.body.typeOf
    });

    GenerateOffer.updateOne({ _id: req.params.id }, generateOffer)
        .then((result) => {
            res.status(201).json({
                message: 'success'
            });
        })
        .catch(() => {
            res.status(500).json({
                message: 'server error'
            })
    })
})

router.get('/:id', (req, res, next) => {
    GenerateOffer.findById(req.params.id)
        .then((result) => {
            if (result == null) {
                res.status(404).json({
                    message: 'not found'
                })
            }
            res.status(200).json({
                result
            })
        })
        .catch(() => {
            res.status(500).json({
            message: 'server error'
        })
    })
})

router.delete('/:id', (req, res, next) => {
    GenerateOffer.deleteOne({ _id: req.params.id })
        .then((result) => {
            res.status(200).json({
                message: 'success'
            })
        })
        .catch(() => {
            res.status(500).json({
                message: 'server error'
            });
        });
})

module.exports = router;