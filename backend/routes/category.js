const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    var categories = [
        { _id: 1, img: "assets/img1.jpg", title: "flower" },
        { _id: 2, img: "assets/img2.jpg", title: "balloon" },
        { _id: 3, img: "assets/img3.jpg", title: "glass" },
        { _id: 4, img: "assets/img4.jpg", title: "Mobile" },
        { _id: 5, img: "assets/img1.jpg", title: "Mobile" },
        { _id: 6, img: "assets/img2.jpg", title: "Mobile" },
        { _id: 7, img: "assets/img3.jpg", title: "Mobile" },
        { _id: 8, img: "assets/img4.jpg", title: "Mobile" },
        { _id: 9, img: "assets/img1.jpg", title: "Mobile" },
        { _id: 10, img: "assets/img2.jpg", title: "Mobile" },
        { _id: 11, img: "assets/img3.jpg", title: "Mobile" },
        { _id: 12, img: "assets/img4.jpg", title: "Mobile" }
    ];

    res.status(200).json({
        categories: categories
    });
});

router.get('/:id', (req, res, next) => {
    let result = [];
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
            img: "assets/img2.jpg"
        },
        {
            _id: 1,
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
            _id: 1,
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
            _id: 1,
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
    function checkCategory(product) {
        if (product.category == req.params.id) {
            return product;
        }
    }
    result = products.filter(checkCategory);
    console.log(result);

    res.json({
        result: result
    })
});

module.exports = router;