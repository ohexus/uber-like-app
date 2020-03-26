const router = require('express').Router();

const User = require('../../models/User');

router.post('/deleteuser', async (req, res) => {
    
    await User.deleteOne({ _id: req.user._id }, (e) => {
        if (e) return handleError(e);
        console.log('Successful deletion');
    });
    
    res.clearCookie('token');
});

module.exports = router;