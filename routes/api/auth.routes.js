const router = require('express').Router();
const fs = require('fs');
const path = require('path').join(__dirname, '../../uploads/default.jpeg');
const jwt = require('jsonwebtoken');
const config = require('config');

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const User = require('../../models/User');
const Weather = require('../../models/Weather');

// User Schema
// firstName: String,
// lastName: String,
// username: String,
// email: String,
// mobileNumber: String,
// password: String,
// role: String,
// avatarImg: Buffer

// api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, username, email, mobileNumber, password, role } = req.body;

        if ( !firstName || !lastName || !username || !email || !mobileNumber || !password || !role ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        const userFound = await User.findOne({ $or: [
            { 'username': username },
            { 'email': email },
            { 'mobileNumber': mobileNumber }
        ]});

        if (userFound) {
            return res.status(401).json({ status: 'This email, username or mobile number is already registered' });
        }
        
        const defaultImg = fs.readFileSync(path);
        const encode_defaultImg = defaultImg.toString('base64');

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            mobileNumber: mobileNumber,
            password: hashedPassword,
            role: role,
            avatarImg: { 
                data: Buffer.from(encode_defaultImg, 'base64'),
                contentType: 'image/jpeg'
            }
        });
        
        await user.save();

        const weather = new Weather({
            created_by: user._id
        })

        await weather.save();

        res.status(200).send({ _id: user._id});

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(401).json({ status: 'Please fill in the login and password fields' });
        }

        const user = await User.findOne({ $or: [
            { 'email': login },
            { 'username': login }
        ]});

        if (!user) {
            return res.status(400).json({ status: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ status: 'Incorrect password' });
        }

        const jwt_token = jwt.sign(
            { _id: user._id },
            config.get('jwtSecret')
        );

        res.header('authorization', jwt_token);

        res.status(200).send(jwt_token);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/recoverPassword
router.put('/recoverPassword', async (req, res) => {  
    try {  
        const { userId, newPassword } = req.body;

        await User.findOneAndUpdate({ 
            _id: userId
        }, {
            password: newPassword
        }, {new: true});

        res.status(200).json({ status: 'successful updated password' });

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/auth/recoverPasswordCheckUser
router.post('/recoverPasswordCheckUser', async (req, res) => {  
    try {  
        const { username, email, firstName, lastName, mobileNumber } = req.body;

        const user = await User.findOne({ $and: [
            { username: username },
            { email: email },
            { firstName: firstName },
            { lastName: lastName },
            { mobileNumber: mobileNumber },
        ]});

        if (!user) {
            return res.status(403).send('Nothing');
        }

        res.status(200).send(user);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;