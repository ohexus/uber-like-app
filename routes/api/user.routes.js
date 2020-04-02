const router = require('express').Router();
const fs = require('fs');
const multer  = require('multer')

const upload = multer({ dest: '../../uploads/' })

const User = require('../../models/User');

// User Schema
// firstName: String,
// lastName: String,
// username: String,
// email: String,
// mobileNumber: String,
// password: String,
// role: String,
// avatarImg: { data: Buffer, contentType: String }

// api/user/userinfo
router.get('/userInfo', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });

        res.status(200).send(user);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/updateuser
router.put('/updateUser', async (req, res) => {
    try {
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

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/updatepassword
router.put('/updatePassword', async (req, res) => {
    try {
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

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/updateavatar
router.put('/updateAvatar', upload.single('avatar'), async (req, res) => {  
    try {
        await User.findOneAndUpdate({ 
            _id: req.user._id 
        }, {
            avatarImg: {
                data: fs.readFileSync(req.file.path),
                contentType: req.file.mimetype
            }
        });

        res.status(200).json({ status: 'successful updated avatar' });

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/delete
router.delete('/delete', async (req, res) => {
    try {
        await User.deleteOne({ _id: req.user._id }, (e) => {
            if (e) return handleError(e);
        });

        res.status(200).json({ status: 'successful deletion' });

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/deleteall
router.delete('/deleteAll', async (req, res) => {
    try {
        await User.deleteMany({}, (e) => {
            if (e) return handleError(e);
        });

        res.status(200).json({ status: 'successful deletion' });

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/all
router.get('/all', async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).send(users);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;