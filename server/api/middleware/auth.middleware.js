const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  try {
    const jwt_token = req.header('authorization');

    if (!jwt_token) return res.status(401).json({ status: 'Unauthorized' });

    const user = jwt.verify(jwt_token, config.get('jwtSecret'));

    req.userId = user._id;
    req.userRole = user.role;
  } catch (e) {
    res.status(500).json({ status: e.message });
  }

  next();
};
