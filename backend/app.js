const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const products = require("./routes/products");
const category = require("./routes/category");
const auth = require("./routes/auth");
const user = require("./routes/user");
const offer = require("./routes/offer");
const generateOffer = require("./routes/generateOffer");
const editOffer = require("./routes/editOfferProduct");
const purchase = require("./routes/purchase");
const recent = require("./routes/recent");
const orders = require("./routes/orders");
const addOns = require("./routes/addOns");
const employee = require("./routes/employee");

const bodyParser = require("body-parser");
const features = require("./routes/feature");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://127.0.0.1:27017/vallabhBhog")
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("failed connection to database:", error));

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api/auth", auth);
app.use("/api/AddOns", addOns);
app.use("/api/recent", recent);
app.use("/api/features", features);
app.use("/api/category", category);
app.use("/api/products", products);
app.use("/api/offer", offer);
app.use("/api/offers", generateOffer);
app.use("/api/editOffer", editOffer);
app.use("/api", user);
app.use("/api/", purchase);
app.use("/api/", orders);
app.use("/api/employee", employee);
//app.use('/api/notification/', notification);

module.exports = app;
