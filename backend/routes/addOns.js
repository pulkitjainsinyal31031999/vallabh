const express = require('express');
const router = express.Router();

const multer = require('multer');
const addOns = require('../models/addOns');
const AddOns = require('../models/addOns');

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


router.get('/', (req, res, next) => {
    AddOns.find()
        .then((addOns) => {
            res.status(200).json({
                addOns
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message
            });
        });
});

router.get('/:id', (req, res, next) => {
    addOns.findById(req.params.id)
        .then((addOns) => {
            if (addOns == null) {
                throw err = { message: 'not found' };
            } else {
                res.status(200).json({
                    addOns
                });
            }
        })
        .catch((err) => {
            if (err.message == 'not found') {
                res.status(404).json({
                    message: err.message
                });
            }
            else {
                res.status(500).json({
                    message: err.message
                })
            }
        });
});

router.post('/', checkout, multer({ storage: storage }).single('image'), (req, res, next) => {
    const addOns = new AddOns({
        title: req.body.title,
        available: req.body.available,
        price: req.body.price,
        image: port + '/images/' + req.file.filename
    });
    addOns.save()
        .then((addOns) => {
            res.status(201).json({
                addOns
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message
            });
        });
});

router.put('/:id', checkout, multer({ storage: storage }).single('image'), (req, res, next) => {
    let image;
    if (req.file != undefined) {
        image = port + '/images/' + req.file.filename;
    }
    else {
        image = req.body.image
    }
    const addOns = AddOns({
        title: req.body.title,
        available: req.body.available,
        price: req.body.price,
        image: image
    });
    AddOns.updateOne({ _id: req.params.id }, {
        title: req.body.title,
        available: req.body.available,
        image: image
    })
        .then((addOns) => {
            res.status(201).json({
                addOns
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message
            });
        });
});

router.delete('/:id', checkout, (req, res, next) => {
    AddOns.deleteOne({ _id: req.params.id })
        .then((result) => {
            res.status(201).json({
                result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message
            });
        });
})

router.put('/status/:id', (req, res, next) => {
    AddOns.findById(req.params.id)
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
        });
})


module.exports = router;