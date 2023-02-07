const express = require("express");
const { title } = require("process");
const Products = require("../models/product");
const router = express.Router();
const multer = require("multer");
const check_in = require("../middleware/check_in");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const url = require("./../url").url;

let port = process.env.port != undefined ? process.env.port : url;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

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
    const name = file.originalname.toLowerCase().split(" ").join("-");
    var ext;
    if (file.mimetype == "image/jpg") {
      ext = "jpg";
    }
    if (file.mimetype == "image/jpeg") {
      ext = "jpg";
    }
    if (file.mimetype == "image/png") {
      ext = "png";
    }
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.get("/search/:search", (req, res, next) => {
  Products.find({ $text: { $search: req.params.search } })
    .populate("addOns")
    .then((result) => {
      if (result.length == 0) {
        res.status(200).json({
          message: "not found",
        });
      } else {
        res.status(200).json({
          result,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "server error",
      });
    });
});

router.post(
  "/",
  multer({ storage: storage }).array("images"),
  (req, res, next) => {
    let images = [];
    req.files.forEach((file) => {
      images.push(port + "/images/" + file.filename);
    });
    let product = new Products({
      title: req.body.title,
      price: req.body.price,
      available: req.body.available,
      category: req.body.category,
      size: req.body.size,
      gst: req.body.gst,
      description: req.body.description,
      images: images,
      mrp: req.body.mrp,
      discount: req.body.discount,
      gst: req.body.gst,
      addOns: req.body.addOns.split(","),
    });
    product
      .save()
      .then(() => {
        res.status(200).json({
          message: "success",
          product: product,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Adding a product failed!",
        });
      });
  }
);

router.get("/", (req, res, next) => {
  Products.find()
    .populate("category")
    .populate("addOns")
    .then((result) => {
      let counts;
      res.status(200).json({
        products: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(501).json({
        message: "Server error",
      });
    });
});

router.get("/recentlyViewed", check_in, (req, res, next) => {
  user
    .findById(jwt.decode(req.headers.api_key).id)
    .populate({ path: "recentlyViewed.id" })
    .then((result) => {
      let products = [];
      if (result != null) {
        products = result.recentlyViewed;
      }

      res.status(200).json({
        products: products,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Products.findById(req.params.id)
    .populate("category")
    .populate("addOns")
    .then((result) => {
      if (result === null) {
        res.status(200).json({
          message: "not found",
        });
      }
      res.status(200).json({
        product: result,
      });
    });
});

router.put(
  "/:id",
  multer({ storage: storage }).array("images"),
  (req, res, next) => {
    let images;
    let newImage = false;
    if (req.files) {
      const url = port + "/images/";
      images = url + req.files[0].filename;
      newImage = true;
    }
    let product = new Products({
      _id: req.params.id,
      title: req.body.title,
      price: req.body.price,
      available: req.body.available,
      category: req.body.category,
      color: req.body.color,
      Material: req.body.material,
      gst: req.body.gst,
      description: req.body.description,
      mrp: req.body.mrp,
      discount: req.body.discount,
      addOns: req.body.addOns.split(","),
      images: images,
    });
    Products.findOne({ _id: req.params.id })
      .populate("category")
      .then((result) => {
        if (newImage && result.images.length > 0) {
          console.log(result.images);
          fs.unlink(
            "backend" + result.images[0].slice(url.length),
            (err) => {}
          );
          result.images = images;
        }
        result
          .updateOne(product)
          .then((res1) => {
            res.status(204).json({
              message: "update Successfully",
              product: res1,
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "server error",
            });
          });
      });
  }
);

router.delete("/:id", (req, res, next) => {
  Products.findOne({ _id: req.params.id })
    .then((result) => {
      fs.unlink("backend" + result.images[0].slice(url.length), (err) => {});
      result.delete().then(() => {
        res.status(204).json({
          message: "product deleted Successfully!",
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "server error",
      });
    });
});

router.put("/status/:id", (req, res, next) => {
  Products.findById(req.params.id)
    .then((result) => {
      if (result == null) {
        throw (err = { message: "not found" });
      }
      result.available = !result.available;
      result.save().then(() => {
        res.status(201).json({
          status: result.available,
          change: true,
        });
      });
    })
    .catch((err) => {
      if (err.message == "not found") {
        res.status(404).json({
          change: false,
          message: "not found",
        });
      } else {
        res.status(500).json({
          change: false,
          message: "server error",
        });
      }
    });
});

module.exports = router;
