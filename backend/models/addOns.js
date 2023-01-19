const mongoose = require('mongoose');

const addOnsSchema = mongoose.Schema({
    title: String,
    available: Boolean,
    price: Number,
    image: String
});

module.exports = mongoose.model('addOns', addOnsSchema);