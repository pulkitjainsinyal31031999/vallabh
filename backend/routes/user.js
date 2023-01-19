const express = require("express");
const user = require("../models/user");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const check_in = require("../middleware/check_in");
const jwt = require("jsonwebtoken");
const { validate } = require("../models/user");

const validateAuth = "fkjnveefve";

router.get("/cart", check_in, (req, res, next) => {
  let api_key = jwt.decode(req.headers.api_key, validateAuth);
  User.findById({ _id: api_key.id })
    .populate({ path: "cart.id", populate: { path: "category" } })
    .then((results) => {
      results.populate({ path: "cart.addOns" }).then((result) => {
        res.status(200).json(result);
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "server error",
      });
    });

  //    var User = User.aggregate([{ "cart": "$Product" }])
});

router.post("/cart", check_in, (req, res, next) => {
  let auth = jwt.decode(req.headers.api_key, validateAuth);
  user
    .findById({ _id: auth.id })
    .then((result) => {
      if (result == null) {
        throw (err = { code: 401 });
      }
      let cart = { id: req.body.id, no_of_items: req.body.no_of_items };
      cart.addOns = [];
      if (req.body.addOns.length != 0) {
        req.body.addOns.forEach((addOn) => {
          cart.addOns.push(addOn._id);
        });
      }
      result.cart.push(cart);
      result.save().then((cart) => {
        message: "success",
          res.status(201).json({
            cart: cart.cart,
          });
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.code == 401) {
        res.status(401).json({
          message: "You are not Authorize!",
        });
      } else {
        res.status(500).json({
          message: err.message,
        });
      }
    });
});

router.put("/cart", check_in, (req, res, next) => {
  const auth = jwt.decode(req.headers.api_key, validateAuth);
  user
    .findById({ _id: auth.id })
    .then((result) => {
      result.cart = req.body.cart;
      result.save().then(() => {
        res.status(200).json({
          message: "success",
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "server error",
      });
    });
});

router.put("/cart/:id", check_in, (req, res, next) => {
  const auth = jwt.decode(req.headers.api_key, validateAuth);
  user
    .findById({ _id: auth.id })
    .then((result) => {
      if (
        result.cart.length == 0 ||
        result.cart.length == null ||
        result.cart == undefined
      ) {
        err = { message: "Something went wrong" };
        throw err;
      } else {
        console.log(req.body.cart);
        result.cart.forEach((cart) => {
          if (cart._id == req.body.cart._id) {
            cart.addOns = req.body.cart.addOns;
          }
        });
        result.save().then((results) => {
          res.status(200).json({
            message: "success",
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!",
      });
    });
});

router.delete("/cart/:id", check_in, (req, res, next) => {
  const auth = jwt.decode(req.headers.api_key, validateAuth);
  user
    .findById({ _id: auth.id })
    .populate({ path: "cart.id" })
    .then((result) => {
      if (result.cart != []) {
        result.cart = result.cart.filter((cart) => {
          count = 0;
          if (cart._id != req.params.id) {
            return cart;
          } else if (cart._id == req.params.id) {
            count = 1;
          }
        });
        result.save().then(() => {
          if (count == 0) {
            res.status(200).json({
              result,
              message: "not found",
            });
          } else {
            res.status(200).json({
              message: "success",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "server error",
      });
    });
});

router.get("/wishlist", check_in, (req, res, next) => {
  const auth = jwt.decode(req.headers.api_key, validateAuth);
  User.findById({ _id: auth.id })
    .populate({ path: "wishList.id", populate: { path: "addOns" } })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: "server error",
      });
    });
});

router.post("/wishlist", check_in, (req, res, next) => {
  const auth = jwt.decode(req.headers.api_key, validateAuth);
  user.findById({ _id: auth.id }).then((result) => {
    let product = {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    };
    product.id = req.body.id;
    if (result.wishList.length === 0) {
      result.wishList.push(product);
    } else {
      let count = 0;
      result.wishList.forEach((wish) => {
        if (wish.id == req.body.id) {
          count = 1;
          res.status(200).json({
            message: "done",
          });
        }
      });
      if (count == 0) {
        result.wishList.push(product);
      }
    }
    let wishlist = result.wishList;
    result
      .save()
      .then((wishLists) => {
        res.status(200).json({
          message: "success",
          wishlist,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "server error",
        });
      });
  });
});

router.put("/wishlist", check_in, (req, res, next) => {
  const auth = jwt.decode(req.headers.api_key, validateAuth);
  user
    .findById({ _id: auth.id })
    .then((result) => {
      result.wishList = req.body.wish;
      result.save().then((res1) => {
        res.status(200).json({
          message: "success",
          wish: res1.wish,
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "server error",
      });
    });
});

router.delete("/wishlist/:id", check_in, (req, res, next) => {
  const auth = jwt.decode(req.headers.api_key, validateAuth);
  user
    .findById({ _id: auth.id })
    .then((result) => {
      if (result.wishList != []) {
        result.wishList = result.wishList.filter((wish) => {
          count = 0;
          if (wish.id != req.params.id) {
            return wish;
          } else {
            count = 1;
          }
        });
        let results = result.wishList;
        result.save().then(() => {
          res.status(200).json({
            results,
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "server error",
      });
    });
});

module.exports = router;
