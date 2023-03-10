const express = require("express");
const router = express.Router();
const check_out = require("../middleware/check_out");

let online = true;

router.get("/", (req, res, next) => {
  res.status(200).json(online);
});

router.post("/", check_out, (req, res, next) => {
  online = !online;
  req.app.get("socketio").emit("availability", online);
  res.status(201).json({
    online,
  });
});

module.exports = { router, online };
