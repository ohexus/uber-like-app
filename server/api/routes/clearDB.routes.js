const router = require('express').Router();

const RequestLog = require('../../models/RequestLog');
const User = require('../../models/User');
const Load = require('../../models/Load');
const Truck = require('../../models/Truck');
const Weather = require('../../models/Weather');

// api/clearDB/
router.delete('/', async (req, res) => {
  try {
    const requestLog = await RequestLog.deleteMany({});
    const user = await User.deleteMany({});
    const load = await Load.deleteMany({});
    const truck = await Truck.deleteMany({});
    const weather = await Weather.deleteMany({});

    res.status(200).send({
      requestLog,
      user,
      load,
      truck,
      weather,
    });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

module.exports = router;
