const express = require('express');
const router = express.Router();
const Offer = require('../models/slideOffer');
const multer = require('multer');

let port = process.env.port != undefined ? process.env.port : 'http://192.168.29.126:3000';

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
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
        if (file.mimetype == "image/jpg") {
            ext = 'jpg'
        }
        if (file.mimetype == "image/jpeg") {
            ext = 'jpg'
        }
        if (file.mimetype == "image/png") {
            ext = 'png';
        }
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});



router.get('/offerSlide', (req, res, next) => {
    Offer.find()
        .populate(['category', 'product'])
        .then((result) => {
            res.status(200).json({
                result
            })
        })
});

router.get('/offerSlide/:id', (req, res, next) => {
    console.log('hi');
    Offer.findById(req.params.id)

        .then((result) => {
            if (result === null) {
                res.status(404).json({
                    message: 'not found'
                })
            }
            res.status(200).json({
                result
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: 'server error'
            });
        })
});

router.post('/offerSlide', multer({ storage: storage }).single('file'), (req, res, next) => {
    let offer = new Offer({
        location: req.body.location,
        image: port + '/images/' + req.file.filename,
        category: req.body.category,
        product: req.body.product,
        feature: req.body.feature,
        typeOf: req.body.typeOf
    });
    offer.save()
        .then((result) => {
            res.status(201).json({
                message: 'success'
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: 'server error'
            })
        })
});

router.put('/offerSlide/:id', multer({ storage: storage }).single('file'), (req, res, next) => {
    let images;
    if (req.file != undefined && req.file.length !== 0) {
        let url = port + '/images/' + req.file.filename;
        images = url
    }
    else {
        images = req.body.file;
    }
    const offer = new Offer({
        _id: req.params.id,
        location: req.body.location,
        image: images,
        category: req.body.category,
        product: req.body.product,
        feature: req.body.feature,
        typeOf: req.body.typeOf
    });
    Offer.updateOne({ _id: req.params.id }, offer).then((result) => {
        res.status(201).json({
            message: "success"
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'server error'
        })
    }
    )
});

router.delete('/offerSlide/:id', (req, res, next) => {
    Offer.deleteOne({ _id: req.params.id })
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: "success"
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
            message: 'error'
        })
    })
})

module.exports = router;