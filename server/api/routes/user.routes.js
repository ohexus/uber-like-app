const router = require('express').Router();

const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: '../../uploads/' });

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
    const user = await User.findOne({ _id: req.userId });

    if (!user) return res.status(200).json({ status: 'User not found' });

    res.status(200).json({
      status: 'OK',
      user,
    });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/user/updateUser
router.put('/updateUser', valid(userValid.updateUser, 'body'), async (req, res) => {
  try {
    const { firstName, lastName, username, email, mobileNumber } = req.body;

    if (!firstName || !lastName || !username || !email || !mobileNumber) {
      return res.status(200).json({ status: 'Please fill in all the fields' });
    }

    const userFound = await User.findOne({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ username }, { email }, { mobileNumber }] },
      ],
    });

    if (userFound) {
      return res.status(200).json({ status: 'This email, username or mobile number is already registered' });
    }

    const updatedUser = await User.findOneAndUpdate({
      _id: req.userId,
    }, {
      firstName,
      lastName,
      username,
      email,
      mobileNumber,
      $push: {
        logs: {
          message: 'user updated',
        },
      },
    }, { new: true });

    req.io.emit('updateUser', updatedUser);

    res.status(200).json({
      status: 'OK',
      updatedUser,
    });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/user/updatePassword
router.put('/updatePassword', valid(userValid.updatePassword, 'body'), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(200).json({ status: 'Please fill in all the fields' });
    }

    const user = await User.findOne({
      _id: req.userId,
    });

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(200).json({ status: 'Wrong old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({
      _id: req.userId,
    }, {
      password: hashedPassword,
      $push: {
        logs: {
          message: 'password updated',
        },
      },
    });

    res.status(200).json({ status: 'OK' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/user/updateAvatar
router.put('/updateAvatar', upload.single('avatar'), async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({
      _id: req.userId,
    }, {
      avatarImg: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      },
      $push: {
        logs: {
          message: 'avatar updated',
        },
      },
    }, { new: true });

    req.io.emit('updateAvatar', updatedUser);

    res.status(200).json({ status: 'successful updated avatar' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/user/all
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({ users });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/user/delete
router.delete('/delete', async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({ _id: req.userId }, (e) => {
      if (e) return handleError(e);
    });

    res.status(200).json({ deletedUser });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/user/deleteAll
router.delete('/deleteAll', async (req, res) => {
  try {
    const deletedUsers = await User.deleteMany({}, (e) => {
      if (e) return handleError(e);
    });

    res.status(200).json({ deletedUsers });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

module.exports = router;
