const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(401).json({ status: 'Please fill in the name and password fields' });
        }

        const user = await User.findOne({ $or: [
            { 'email': login },
            { 'phone': login }
        ]});

        if (!user) {
            return res.status(400).json({ status: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ status: 'Incorrect password' });
        }

        const jwt_token = jwt.sign(
            { _id: user._id },
            config.get('jwtSecret')
        );

        res.cookie('token', jwt_token);

        res.json({ jwt_token, _id: user._id });

        console.log('Successful login');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;