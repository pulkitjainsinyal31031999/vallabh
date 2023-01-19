const express = require('express');
const router = express.Router();

const Products = require('../models/product');

router.get('/:id', (req, res, next) => {
    Products.find({ category: req.params.id })
        .populate('category')
        .populate('addOns')
        .then((result) => {
            result.forEach((doc) => {
                doc.images = doc.images[0];
            })
            res.status(200).json({
                product: result
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(501).json({
                message: 'server error'
            })
        })
})

module.exports = router;