const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title: String,
    available: Boolean,
    image: String
});

categorySchema.index({ '$**': 'text' })

module.exports = mongoose.model("Category", categorySchema);