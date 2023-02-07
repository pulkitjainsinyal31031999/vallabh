const express = require("express");
const router = express.Router();
const multer = require("multer");
const check_in = require("../middleware/check_in");
const check_out = require("../middleware/check_out");
const check_deliver = require("../middleware/check_deliver");
const employee = require("../models/employee");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Orders = require("../models/orders");
const url = require("./../url").url;

let port = process.env.port != undefined ? process.env.port : url;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/svg": "svg",
  "image/svg+xml": "svg",
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
    if (file.mimetype == "image/svg") {
      ext = "svg";
    }
    if (file.mimetype == "image/svg+xml") {
      ext = "svg";
    }
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.get("/", check_out, (req, res, next) => {
  employee
    .find()
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.get("/deliver", check_deliver, (req, res, next) => {
  Orders.find({ deliveryPathWay: "deliveryBoy", deliveryBoy: null })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/pick", check_deliver, (req, res, next) => {
  Orders.findById(req.body.id)
    .then((result) => {
      if (result.deliveryBoy != null) {
        res.status(200).json({
          message: "Sorry Order is already pick up!",
        });
      } else {
        result.deliveryBoy = jwt.decode(req.headers.api_key).id;
        result.pickTime = new Date();
        employee.findById(jwt.decode(req.headers.api_key).id).then((emp1) => {
          emp1.orders.push({ order: req.body.id, orderPickTime: new Date() });
          emp1.save().then(() =>
            result.save().then(() => {
              req.app.get("socketio").emit("pickOrder", {
                _id: result._id,
                name: emp1.name,
                time: new Date(),
              });
              res.status(200).json({
                message: "Done!",
              });
            })
          );
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.get("/emp", check_deliver, (req, res, next) => {
  employee
    .findById(jwt.decode(req.headers.api_key).id)
    .select(["name", "phoneNo", "orders"])
    .populate({ path: "orders.order" })
    .then((result) => {
      result
        .populate("orders.order.userId", "phoneNo firstName lastName")
        .then((res1) => {
          if (result == null) {
            res.status(401).json({
              message: "Please login again!",
            });
          } else {
            res.status(200).json(result);
          }
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/:id", check_out, (req, res, next) => {
  employee
    .findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.post(
  "/",
  check_out,
  multer({ storage: storage }).array("image"),
  (req, res, next) => {
    let Employee = new employee({
      name: req.body.name,
      password: req.body.password,
      phoneNo: req.body.phoneNo,
      image: port + "/images/" + req.files[0].filename,
      time: new Date(),
    });
    Employee.save()
      .then((result) => {
        res.status(201).json({
          message: "success",
          employee,
        });
      })
      .catch((err) => {
        if (err.code == 11000) {
          res.status(401).json({
            message: "Phone Number already exist!",
          });
        } else {
          res.status(500).json({
            message: err.message,
          });
        }
      });
  }
);

router.put("/delivered", check_deliver, (req, res, next) => {
  Orders.findById(req.body.id)
    .then((result) => {
      result.status = "Delivered";
      result.deliveryTime = new Date();
      req.app
        .get("socketio")
        .emit("delivered", { _id: result._id, time: result.deliveryTime });
      result.save();

      result.populate("userId").then((user) => {
        user.userId.orders = user.userId.orders.filter((order) => {
          if (order.id != req.body.id) {
            return order;
          } else {
            user.userId.purchase.push(order);
          }
        });
        user.userId.save();
        res.status(200).json({ message: "h" });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.put(
  "/:id",
  check_out,
  multer({ storage: storage }).array("images"),
  (req, res, next) => {
    let images;
    img = "old";
    if (req.files != undefined && req.files.length !== 0) {
      images = port + "/images/" + req.files[0].filename;
      img = "new";
    } else {
      images = req.body.images;
    }

    let Employee = new employee({
      _id: req.params.id,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      password: req.body.password,
      date: req.body.date,
      image: images,
    });
    employee
      .updateOne({ _id: req.params.id }, Employee)
      .then((result) => {
        if (img == "new") {
          fs.unlink("backend" + req.body.image.slice(url.length), (err) => {
            console.log("err: " + err);
          });
        }
        res.status(201).json({
          result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  }
);

router.post("/login", (req, res, next) => {
  employee
    .findOne({ phoneNo: req.body.phoneNo })
    .then((result) => {
      if (result == null) {
        res.status(400).json({
          message: "Please recheck your Phone number",
        });
      } else if (result.password == req.body.password) {
        let token = jwt.sign({ id: result._id }, "oindvoiwenrrv");
        res.status(200).json({
          message: "success",
          api_key: token,
        });
      } else if (result.password != req.body.password) {
        res.status(401).json({
          message: "Please recheck your password!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
});

module.exports = router;
