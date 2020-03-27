const { Schema, model } = require('mongoose');

module.exports = model('User', new Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    mobile_number: String,
    password: String,
    role: String
}));