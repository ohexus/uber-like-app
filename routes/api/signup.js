const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, isDriver } = req.body;

        if ( !firstName || !lastName || !email || !password || !phone ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        const userFound = await User.findOne({ $or: [
            { 'email': email },
            { 'phone': phone }
        ]});

        if (userFound) {
            return res.status(401).json({ status: 'This email or phone number is already registered' });
        }
        
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phone: phone,
            isDriver: isDriver
        });
        
        await user.save();

        res.status(201).json({ status: "The user has been created" });

        console.log('Successful signup');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;