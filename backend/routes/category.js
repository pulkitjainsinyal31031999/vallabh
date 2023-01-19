const express = require('express');

const router = express.Router();

const Category = require('../models/category');
const multer = require('multer');
const check_in = require('../middleware/check_in');
const checkout = require('../middleware/check_out');

let port = process.env.port != undefined ? process.env.port : 'http://192.168.29.126:3000';

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/svg': 'svg',
    'image/svg+xml': 'svg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        var error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        var ext
        console.log(file.mimetype);
        if (file.mimetype == "image/jpg") {
            ext = 'jpg'
        }
        if (file.mimetype == "image/jpeg") {
            ext = 'jpg'
        }
        if (file.mimetype == "image/png") {
            ext = 'png';
        }
        if (file.mimetype == "image/svg") {
            ext = 'svg';
        }
        if (file.mimetype == "image/svg+xml") {
            ext = 'svg';
        }
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});


router.get('/search/:search', (req, res, next) => {
    Category.find({ $text: { $search: req.params.search } })
        .then((result) => {
            if (result.length == 0) {
                res.status(200).json({
                    message: 'not found'
                })
            } else {
                res.status(200).json({
                    result
                });
            }
        })
})

router.post('/', checkout,multer({ storage: storage }).array('images'), (req, res, next) => {
    console.log(req.body);
    const category = new Category({
        title: req.body.title,
        available: req.body.available,
        image: port + '/images/' + req.files[0].filename
    });
    category.save().then((result) => {
        res.status(201).json({
            message: 'category created',
            category: result
        })
    })
})

router.get('/', (req, res, next) => {
    Category.find().then(result => {
        res.status(200).json({
            categories: result
        });
    })
});

router.put('/status/:id', (req, res, next) => {
    Category.findById(req.params.id)
        .then((result) => {
            if (result == null) {
                throw err = { message: 'not found' };
            }
            result.available = !result.available;
            result.save().then(() => {
                res.status(201).json({
                    status: result.available,
                    change: true
                });
            });
        })
        .catch((err) => {
            if (err.message == 'not found') {
                res.status(404).json({
                    change: false,
                    message: 'not found'
                });
            }
            else {
                res.status(500).json({
                    change: false,
                    message: 'server error'
                });
            }
        })
});

router.get('/:id', (req, res, next) => {
    Category.find({ _id: req.params.id }).then(result => {
        res.status(200).json({
            category: result
        })
    }).catch((error) => {
        console.log(error);
        res.status(501).json({
            message: 'server error'
        })
    })
});

router.put('/:id', checkout,multer({ storage: storage }).array('image'), (req, res, next) => {
    console.log('hi', req.body);
    let images;
    if (req.files != undefined && req.files.length !== 0) {
        let url = port + '/images/' + req.files[0].filename;
        images = url
    }
    else {
        images = req.body.images;
    }
    let category = new Category({
        _id: req.params.id,
        title: req.body.title,
        available: req.body.available,
        image: images
    });
    Category.updateOne({ _id: req.params.id }, category)
        .then((result) => {
            res.status(204).json({
                message: 'success',
                result: result
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).json({
                message: 'server error'
            })
        })
});


module.exports = router;