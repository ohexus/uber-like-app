const router = require('express').Router();

const User = require('../../models/User');

router.post('/deleteuser', async (req, res) => {
    
    await User.deleteOne({ _id: req.user._id }, (e) => {
        if (e) return handleError(e);
        console.log('Successful deletion');
    });

    res.json({ status: 'successful deletion' });
});

module.exports = router;