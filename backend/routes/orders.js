const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Orders = require("../models/orders");
const Products = require("../models/product");

const check_in = require("../middleware/check_in");
const check_out = require("../middleware/check_out");
const jwt = require("jsonwebtoken");

var token =
  "fLWrY2P_QZin1_b8Ofoe7A:APA91bHWk1UH5OwiX2nbJlPkMZ1ThTSA-3ExUpjlunb4hDKkQl-kCkjlyCqJ81wOjFy_Gwc288sSxbqWMKI_LgCmvMAPILT4EViFDg-TA2EZZB1PUblaUVP1a5KQquYlhkf9n_FSFQ8V";
var users = [];
const serviceAccount = require("../../shagun-ae5f1-firebase-adminsdk-mgxva-d2af4d6369.json");
var admin = require("firebase-admin");
const user = require("../models/user");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/notification", (req, res, next) => {
  token = req.body.data;
  res.status(200).json({
    message: "success",
  });
});

router.get("/notification", (req, res, next) => {
  console.log(users);
  let message = {
    token: users[0].token,
    notification: {
      title: "Hello",
      body: "World",
    },
    priority: "high",
  };
  admin.messaging().send(message);
  res.status(200);
});

router.post("/notification/user", (req, res, next) => {
  let user = {
    userId: req.body.api_key,
    token: req.body.token,
  };
  let count = 0;
  users.forEach((user) => {
    if (user.userId == req.body.api_key) {
      user.token = req.body.token;
      count = 1;
    }
  });
  if (!count) {
    users.push(user);
  }
  console.log(req.body);
  res.status(200);
});

router.get("/orders", check_in, (req, res, next) => {
  User.findById(jwt.decode(req.headers.api_key).id)
    .populate({
      path: "orders.id",
      populate: [
        {
          path: "orders.product",
          select: ["title"],
        },
        {
          path: "orders.addOns",
          select: "title",
        },
      ],
    })
    .then((result) => {
      if (result == null) {
        throw (err.message = "not authenticate");
      }
      let orders = result.orders;
      res.status(200).json({
        orders,
      });
    })
    .catch((err) => {
      if (err.message == "not authenticate") {
        res.status(401).json({
          message: "You are not authorize",
        });
      } else {
        console.log(err);
        res.status(500).json({
          message: "server error",
        });
      }
    });
});

router.post("/orders", check_in, (req, res, next) => {
  let orders = new Orders([]);
  if (req.body.data.length == undefined) {
    let addOns = [];
    req.body.data.addOns.forEach((addOn) => {
      addOns.push(addOn._id);
    });
    orders.orders.push({
      product: req.body.data._id,
      no_of_items: req.body.data.no_of_items,
      addOns: addOns,
    });
  } else {
    req.body.data.forEach((product) => {
      let AddOns = [];
      product.addOns.forEach((addOn) => {
        AddOns.push(addOn._id);
      });
      orders.orders.push({
        product: product.id._id,
        no_of_items: product.no_of_items,
        addOns: AddOns,
      });
    });
  }
  orders.populate({ path: "orders.addOns" }).then((results) => {
    results
      .populate({ path: "orders.product", populate: { path: "category" } })
      .then((result) => {
        var total = 0;
        result.orders.forEach((order) => {
          let price = order.product.price;
          if (!order.product.category.available) {
            throw (error = { message: "Item not available" });
          }
          if (!order.product.available) {
            throw (error = { message: "Item not available" });
          } else {
            order.addOns.forEach((addOn) => {
              price += addOn.price;
              if (!addOn.available) {
                throw (error = { message: "AddOn not available" });
              }
            });
          }
          if (price <= 500) {
            price += 30 * order.no_of_items;
          }
          total += price * order.no_of_items;
        });

        result.totalCost = total;
        result.status = "Order";
        result.time = new Date();
        result.userId = jwt.decode(req.headers.api_key).id;
        result.otp = Math.floor(Math.random() * 100000);
        result.packageId = Math.floor(Math.random() * 10000000);
        result.location = {
          long: req.body.location.long,
          lat: req.body.location.lat,
        };
        result.save().then((orders) => {
          User.findById(jwt.decode(req.headers.api_key).id).then((result) => {
            result.orders.push({ id: orders._id });
            result.save().then((result) => {
              const message = {
                token: token,
                notification: {
                  title: "New order",
                  body:
                    orders.orders.length +
                    " items order, total Cost:" +
                    orders.totalCost,
                },
              };
              //              admin.messaging().send(message);
              req.app.get("socketio").emit("orders", orders);
              res.status(201).json({
                message: "success",
              });
            });
          });
        });
      })
      .catch((err) => {
        if (err.message == "Item not available") {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.status(500).json({
            message: err,
          });
        }
      });
  });
});

router.get("/orders/order", check_out, (req, res, next) => {
  Orders.find({ status: { $ne: "delivered" } })
    .sort("-time")
    .populate({ path: "userId", select: ["phoneNo", "address"] })
    .populate({ path: "orders.product", select: ["images", "title", "price"] })
    .then((result) => {
      res.status(200).json({
        result,
      });
    });
});

router.put("/orders/order/:id", check_out, (req, res, next) => {
  let sock_deliver = false;
  Orders.findById(req.params.id)
    .then((result) => {
      switch (req.body.task) {
        case "acceptOrder":
          result.status = "OrderPreparing";
          break;
        case "cancelOrder":
          result.status = "OrderCancelByAdmin";
          break;
        case "deliverPathOrder":
          if (req.body.deliverWay == null || req.body.deliverWay == undefined) {
            throw (err = {
              code: 400,
              message: "Please resend the respond Path Way is not set!",
            });
          } else if (
            req.body.deliverWay == "deliveryBoy" ||
            req.body.deliverWay == "courierService"
          ) {
            result.deliveryPathWay = req.body.deliverWay;
            if (req.body.deliverWay == "deliveryBoy") {
              sock_deliver = true;
            }
          } else {
            throw (err = {
              code: 400,
              message: "Deliver path way is wrong!",
            });
          }
          break;
        default:
          console.log(req.body);
          throw err;
      }
      result.save().then((res1) => {
        if (sock_deliver) {
          req.app.get("socketio").emit("deliver", res1);
        }
        res.status(201).json({
          msg: result.status,
        });
      });
    })
    .catch((err) => {
      if (err.code == 400) {
        res.status(400).json({
          message: err.message,
        });
      } else {
        console.log(err);
        res.status(501).json({
          message: "server error",
        });
      }
    });
});

router.get("/purchaseHistory", check_in, (req, res, next) => {
  User.findById(jwt.decode(req.headers.api_key).id)
    .populate("purchase.id")
    .then((result) => {
      if (result == null) {
        throw (err.message = "not authenticate");
      }
      let purchaseHistory = result.purchase;
      res.status(200).json({
        purchaseHistory,
      });
    })
    .catch((err) => {
      if (err.message == "not authenticate") {
        res.status(401).json({
          message: "You are not authentic",
        });
      } else {
        res.status(503).json({
          message: "Server error",
        });
      }
    });
});

module.exports = router;
