const express = require("express");
const router = express.Router();
const check_out = require("../middleware/check_out");

let online = false;

router.get("/", (req, res, next) => {
  console.log("getOnline");
  res.status(200).json(online);
});

router.post("/", check_out, (req, res, next) => {
  online = !online;
  req.app.get("socketio").emit("availability", online);
  res.status(201).json({
    online,
  });
});

module.exports = router;
