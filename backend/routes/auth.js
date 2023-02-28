const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");
const decode = require("../middleware/decode");
const check_in = require("../middleware/check_in");

router.post("/registration", (req, res, next) => {
  let id = jwt.decode(req.headers.api_key, "fkjnveefve").id;
  User.findById(id).then((result) => {
    result.firstName = req.body.firstName;
    result.lastName = req.body.lastName;
    result.verification = "verified";
    result.geoPosition = [];
    result.geoPosition.push({ position: req.body.geoPosition });
    result.save().then((result) => {
      res.status(201).json({
        verified: "true",
      });
    });
  });
});

router.post("/signIn", decode, (req, res, next) => {
  User.findOne({ phoneNo: req.body.phone }).then((result) => {
    if (result == null || result.length == 0) {
      let use1 = new User({
        phoneNo: req.body.phone,
      });
      use1.save().then((result) => {
        res.status(201).json({
          message: "user created",
          api_key: jwt.sign({ id: result._id }, "fkjnveefve"),
          verification: "processing",
        });
      });
    } else {
      result.save().then((result) => {
        res.status(201).json({
          message: "user created",
          api_key: jwt.sign({ id: result._id }, "fkjnveefve"),
          verification: result.verification,
        });
      });
    }
  });
});

router.get("/detail", check_in, (req, res, next) => {
  let id = jwt.decode(req.headers.api_key, "fkjnveefve").id;
  User.findById(id)
    .then((result) => {
      res.status(200).json({
        firstName: result.firstName,
        lastName: result.lastName,
        address: result.geoPosition,
        phoneNo: result.phoneNo,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .select(["phoneNo", "address"])
    .then((result) => {
      if (result === null) {
        res.status(200);
      } else {
        res.status(200).json({
          result,
        });
      }
    });
});

router.post("/admin", (req, res, next) => {
  if (req.body.email == "admin@gmail.com" && req.body.password == "admin") {
    let api_key = jwt.sign("shoagoan@admin", "weierfjjviuwb");
    res.status(200).json({
      api_key: api_key,
    });
  } else {
    res.status(401).json({
      message: "Auth Failed! Please recheck email and password",
    });
  }
});

router.put("/updateDetail", check_in, (req, res, next) => {
  let id = jwt.decode(req.headers.api_key, "fkjnveefve").id;
  let user = new User({
    _id: id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  user.geoPosition = [];
  user.geoPosition.push({ position: req.body.address });
  User.updateOne({ _id: id }, user)
    .then((result) => {
      res.status(204).json({
        message: "success",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

module.exports = router;
