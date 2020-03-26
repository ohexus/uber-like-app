const router = require('express').Router();

router.post('/logout', (req, res) => {
    
    res.clearCookie('token');
    
    console.log('Successful logout');
    
});

module.exports = router;