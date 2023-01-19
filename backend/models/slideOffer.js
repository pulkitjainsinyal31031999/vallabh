const mongoose = require('mongoose');

const offerSlideSchema = mongoose.Schema({
    location: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    feature: String,
    typeOf: String
});

module.exports = mongoose.model('offerSlide', offerSlideSchema);