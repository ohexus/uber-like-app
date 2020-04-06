const RequestLog = require('../../models/RequestLog');

// RequestLog Schema
// {
//     method: String,
//     api_url: String,
//     time: {type: Date, default: Date.now()}
// }

module.exports = async (req, res, next) => {
  const requestLog = new RequestLog({
    method: req.method,
    api_url: req.url,
  });

  await requestLog.save();

  next();
};
