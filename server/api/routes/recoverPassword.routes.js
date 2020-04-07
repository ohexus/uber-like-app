const router = require('express').Router();

const config = require('config');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(config.get('salt'));

const valid = require('../middleware/valid.middleware');
const recoverPasswordValid = require('../validation/recoverPassword.validation');

const User = require('../../models/User');

// api/recoverPassword/recover
router.put('/recover', valid(recoverPasswordValid.recover, 'body'), async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({
      _id: userId,
    }, {
      password: hashedPassword,
    });

    res.status(200).json({ status: 'OK' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/recoverPassword/checkUser
router.post('/checkUser', valid(recoverPasswordValid.checkUser, 'body'), async (req, res) => {
  try {
    const { username, email, firstName, lastName, mobileNumber } = req.body;

    const user = await User.findOne({
      $and: [
        { username },
        { email },
        { firstName },
        { lastName },
        { mobileNumber },
      ],
    });

    if (!user) {
      return res.status(200).json({ status: 'User not found' });
    }

    res.status(200).json({
      status: 'OK',
      user,
    });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

module.exports = router;
