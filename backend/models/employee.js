const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    password: String,
    phoneNo: {type: Number, unique: true},
    image: String,
    time: Date,
    orders: [ { order: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }, orderPickTime: Date }]
});

module.exports = mongoose.model('employee', employeeSchema);