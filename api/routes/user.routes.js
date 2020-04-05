const router = require('express').Router();

const fs = require('fs');
const multer = require('multer')
const upload = multer({ dest: '../../uploads/' })

const config = require('config');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(config.get('salt'));

const valid = require('../middleware/valid.middleware');
const userValid = require('../validation/user.validation');

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

        if (!user) return res.status(200).send('User not found');

        res.status(200).send(user);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/updateUser
router.put('/updateUser', valid(userValid.updateUser, 'body'), async (req, res) => {
    try {
        const { firstName, lastName, username, email, mobileNumber } = req.body;

        if (!firstName || !lastName || !username || !email || !mobileNumber) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        const userFound = await User.findOne({
            $or: [
                { username },
                { email },
                { mobileNumber }
            ]
        });

        if (userFound) {
            return res.status(401).json({ status: 'This email, username or mobile number is already registered' });
        }

        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            firstName,
            lastName,
            username,
            email,
            mobileNumber,
            $push: {
                logs: {
                    message: 'user updated'
                }
            }
        });

        res.status(200).json({ status: 'successful update' });

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/updatePassword
router.put('/updatePassword', valid(userValid.updatePassword, 'body'), async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(401).json({ status: 'Please fill in new Password' });
        }

        const user = await User.findOne({
            _id: req.user._id
        });

        const isValidPassword = await bcrypt.compare(oldPassword, user.password);

        if (!isValidPassword) {
            return res.status(400).send('Wrong old password');
        }

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            password: hashedPassword,
            $push: {
                logs: {
                    message: 'password updated'
                }
            }
        });

        res.status(200).json({ status: 'successful updated password' });

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/user/updateAvatar
router.put('/updateAvatar', upload.single('avatar'), async (req, res) => {
    try {
        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            avatarImg: {
                data: fs.readFileSync(req.file.path),
                contentType: req.file.mimetype
            },
            $push: {
                logs: {
                    message: 'avatar updated'
                }
            }
        });

        res.status(200).json({ status: 'successful updated avatar' });

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

// api/user/deleteAll
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

module.exports = router;