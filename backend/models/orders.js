const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  orders: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      no_of_items: Number,
      cost: Number,
      serviceCost: Number,
      addOns: [{ type: mongoose.Schema.Types.ObjectId, ref: "addOns" }],
    },
  ],
  totalCost: Number,
  status: String,
  time: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  otp: Number,
  packageId: { type: String, required: true },
  location: { long: String, lat: String },
  deliveryPathWay: String,
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  pickTime: Date,
  deliveryTime: Date,
});

module.exports = mongoose.model("Orders", ordersSchema);
