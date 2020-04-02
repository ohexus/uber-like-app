const { Schema, model } = require('mongoose');

module.exports = model('RequestLog', new Schema({
    method: String,
    api_url: String,
    time: {type: Date, default: Date.now()}
}));