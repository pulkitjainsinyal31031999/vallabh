const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNo: { type: Number, unique: true },
  verification: String,
  cart: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Product",
      },
      no_of_items: Number,
      addOns: [
        { type: mongoose.Schema.Types.ObjectId, require: true, ref: "addOns" },
      ],
    },
  ],
  wishList: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Product",
      },
    },
  ],
  orders: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Orders",
      },
    },
  ],
  purchase: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Orders",
      },
    },
  ],
  recentlyViewed: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Product",
      },
      timeStamp: Date,
    },
  ],
  recentlySearch: [{ id: { type: String } }],
  geoPosition: [{ position: {} }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
