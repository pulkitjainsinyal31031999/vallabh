const mongoose = require('mongoose');

const generateOfferSchema = mongoose.Schema({
    title: String,
    typeOf: { type: String, enum: ['Category','Product'] },
    list: [{
        type: mongoose.Schema.Types.ObjectId, refPath: 'typeOf'}]
//    model_type: {type: String, enum: ['Product', 'Category']}
});

module.exports = mongoose.model('generateOffer', generateOfferSchema);