const router = require('express').Router();

const User = require('../../models/User');

// api/user/userinfo
router.get('/userinfo', async (req, res) => {
    
    const user = await User.findOne({ _id: req.user._id });

    res.status(200).send(user);
});

// api/user/deleteuser
router.post('/deleteuser', async (req, res) => {
    
    await User.deleteOne({ _id: req.user._id }, (e) => {
        if (e) return handleError(e);
        console.log('Successful deletion');
    });

    res.json({ status: 'successful deletion' });
});

module.exports = router;