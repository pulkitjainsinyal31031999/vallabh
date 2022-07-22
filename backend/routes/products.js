const express = require('express');
const { title } = require('process');
const Products = require('../models/product');
const router = express.Router();

router.get('/', (req, res, next) => {
    var products = [
        {
            _id: 1,
            title: "title",
            category: 1,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img1.jpg"
        },
        {
            _id: 2,
            title: "title",
            category: 1,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img2.jpg"
        },
        {
            _id: 3,
            title: "title",
            category: 2,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img3.jpg"
        },
        {
            _id: 4,
            title: "title",
            category: 2,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img4.jpg"
        },
        {
            _id: 5,
            title: "title",
            category: 3,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img4.jpg"
        },

    ];
    res.status(200).json({
        products: products
    })
});


router.get('/dealsToday', (req, res, next) => {
    var products = [
        {
            _id: 1,
            title: "title",
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img1.jpg"
        },
        {
            _id: 1,
            title: "title",
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img2.jpg"
        },
        {
            _id: 1,
            title: "title",
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img3.jpg"
        },
        {
            _id: 1,
            title: "title",
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img4.jpg"
        },
        {
            _id: 1,
            title: "title",
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img4.jpg"
        },

    ];
    res.status(200).json({
        products: products
    })
});


router.get('/:id', (req, res, next) => {
    var products = [
        {
            _id: 1,
            title: "title",
            category: 1,
            brand: 'ganesh',
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 10,
            size: "20*20",
            color: "green",
            material: "plastic",
            img: ["assets/img1.jpg", "assets/img2.jpg", "assets/img3.jpg"],
            description: [
                "iweurf weiruvb eruv",
                "iweurf weiruvb eruv"
            ]
        },
        {
            _id: 2,
            title: "title",
            category: 1,
            brand: 'suchika',
            rating: 4.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: ["assets/img2.jpg", "assets/img1.jpg"]
        },
        {
            _id: 3,
            title: "title",
            category: 2,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: ["assets/img3.jpg"]
        },
        {
            _id: 4,
            title: "title",
            category: 2,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img4.jpg"
        },
        {
            _id: 5,
            title: "title",
            category: 3,
            rating: 3.5,
            ratingUsers: 322,
            mrp: 500,
            price: 400,
            discount: 20,
            size: "20*20",
            color: "green",
            img: "assets/img4.jpg"
        }
    ];

    let result;
    function product(product) {
        if (product._id == req.params.id) {
            return product
        }
    };
    result = products.filter(product);

    res.status(200).json({
        product: result
    })
})



module.exports = router;