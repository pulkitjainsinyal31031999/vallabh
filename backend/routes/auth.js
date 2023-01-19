const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");

router.post("/", (req, res, next) => {
  User.findOne({ phoneNo: req.body.phone }).then((result) => {
    if (result == null || result.length == 0) {
      let otp = Math.floor(Math.random() * 1000000);
      let otpS = jwt.sign({ otp: otp }, "dkfnnvie", { expiresIn: "1min" });
      let user = new User({
        phoneNo: req.body.phone,
        verification: "processing",
        otp: otpS,
      });
      user.save().then(() => {
        res.status(201).json({
          message: "user created",
          api_key: jwt.sign({ phone: req.body.phone }, "verification", {
            expiresIn: "1hr",
          }),
        });
      });
    } else {
      let otp = 800000 + Math.floor(Math.random() * 100000);
      console.log(otp);
      let otpS = jwt.sign({ otp: otp }, "dkfnnvie", { expiresIn: "1min" });
      result.otp = otpS;
      result.save().then(() => {
        res.status(201).json({
          message: "user created",
          api_key: jwt.sign({ phone: req.body.phone }, "verification", {
            expiresIn: "1hr",
          }),
        });
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  jwt.verify(req.body.api_key, "verification", (err, decode) => {
    if (err != null) {
      res.status(401).json({
        message: "wrong event",
      });
    } else {
      User.findOne({ phoneNo: decode.phone })
        .then((result) => {
          if (result.length == 0) {
            res.status(401).json({
              message: "wrong event",
            });
          } else {
            if (jwt.decode(result.otp).otp == req.body.otp) {
              let api_key = jwt.sign({ id: result._id }, "fkjnveefve");
              res.status(200).json({
                api_key: api_key,
                verification: result.verification,
              });
            } else {
              throw (err = "Incorrect otp");
            }
          }
        })
        .catch((err) => {
          if (err == "Incorrect otp") {
            res.status(401).json({
              message: err.message,
            });
          } else {
            res.status(501).json({
              message: "server error",
            });
          }
        });
    }
  });
});

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

router.get("/detail", (req, res, next) => {
  let id = jwt.decode(req.headers.api_key, "fkjnveefve").id;
  User.findById(id)
    .then((result) => {
      console.log(result);
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

module.exports = router;
