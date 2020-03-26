const mongoose = require('mongoose');

const schema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    phone: String,
    password: String,
    role: String
});

module.exports = mongoose.model('User', schema);