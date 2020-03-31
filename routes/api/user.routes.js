const router = require('express').Router();

const User = require('../../models/User');

// api/user/userinfo
router.get('/userinfo', async (req, res) => {
    
    const user = await User.findOne({ _id: req.user._id });

    res.status(200).send(user);
});

// api/user/updateuser
router.put('/updateuser', async (req, res) => {
    const { firstName, lastName, username, email, mobileNumber } = req.body;

    if ( !firstName || !lastName || !username || !email || !mobileNumber ) {
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
    
    await User.findOneAndUpdate({ 
        _id: req.user._id 
    }, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        mobileNumber: mobileNumber,
    });

    res.status(200).json({ status: 'successful update' });
});

// api/user/updatepassword
router.put('/updatepassword', async (req, res) => {
    const { newPassword } = req.body;

    if ( !newPassword ) {
        return res.status(401).json({ status: 'Please fill in new Password' });
    }
    
    await User.findOneAndUpdate({ 
        _id: req.user._id 
    }, {
        password: newPassword
    });

    res.status(200).json({ status: 'successful updated password' });
});

// api/user/delete
router.delete('/delete', async (req, res) => {
    
    await User.deleteOne({ _id: req.user._id }, (e) => {
        if (e) return handleError(e);
        console.log('Successful deletion');
    });

    res.status(200).json({ status: 'successful deletion' });
});

// api/user/all
router.get('/all', (req, res) => {
    User.find({})
        .then(users => res.json({status: "ok", users}))
        .catch(e => res.status(500).json({status: e.message}));
});

module.exports = router;