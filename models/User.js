const { Schema, model } = require('mongoose');

module.exports = model('User', new Schema({
    logs: [{
        message: {type: String, default: 'User created'},
        time: {type: Date, default: Date.now()}
    }],
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    mobileNumber: String,
    password: String,
    role: String,
    avatarImg: { data: Buffer, contentType: String }
}));