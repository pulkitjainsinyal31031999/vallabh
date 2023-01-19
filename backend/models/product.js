const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: String,
    price: Number,
    available: Boolean,
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    size: String,
    gst: Number,
    description: [String],
    images: [String],
    mrp: Number,
    discount: Number,
    addOns: [ { type: mongoose.Schema.Types.ObjectId, ref: 'addOns' } ]
});

productSchema.index({ '$**': 'text'});

module.exports = mongoose.model("Product", productSchema);