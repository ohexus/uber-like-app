const mongoose = require('mongoose');

const schema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isAssigned: {type: Boolean, default: false},
    truckName: String,
    brand: String,
    model: String,
    carrying: Number,
    length: Number,
    width: Number,
    height: Number
});

module.exports = mongoose.model('Truck', schema);