const router = require('express').Router();

const valid = require('../middleware/valid.middleware');
const loadValid = require('../validation/load.validation');

const User = require('../../models/User');
const Load = require('../../models/Load');
const Truck = require('../../models/Truck');

const findTruckType = require('../../helpers/findTruckType');

// Load Schema {
// created_by: { type: Types.ObjectId, ref: 'User' },
// logs: [{
//     message: { type: String, default: 'Load created' },
//     time: { type: Date, default: Date.now() }
// }],
// assigned_to: { type: Types.ObjectId, ref: 'Truck', default: null },
// status: { type: String, default: 'NEW' },
// state: { type: String, default: null },
// dimensions: {
//     length: Number,
//     width: Number,
//     height: Number
// },
// payload: Number,
// loadName: String,
// address: {
//     pickUp: String,
//     delivery: String
// },
// coord: {
//     pickUp: {
//         lat: { type: Number, default: null },
//         lon: { type: Number, default: null }
//     },
//     delivery: {
//         lat: { type: Number, default: null },
//         lon: { type: Number, default: null }
//     }
// }

// api/load/create
router.post('/create', valid(loadValid.create, 'body'), async (req, res) => {
  try {
    if (req.user.role === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadName, length, width, height, payload } = req.body;

    if (!loadName || !length || !width || !height || !payload) {
      return res.status(403).json({ status: 'Please fill in all the fields' });
    }

    const load = new Load({
      created_by: req.user._id,
      dimensions: {
        length,
        width,
        height,
      },
      payload,
      loadName,
    });

    await load.save();

    res.status(200).send(load);
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/updateCoords
router.put('/updateCoords', valid(loadValid.updateCoords, 'body'), async (req, res) => {
  try {
    if (req.user.role === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadId, pickUpCoords, deliveryCoords, pickUpAddress, deliveryAddress } = req.body;

    if (!loadId || !pickUpCoords || !deliveryCoords) {
      return res.status(403).json({ status: 'Please fill in all fields' });
    }

    await Load.findOneAndUpdate({
      $and: [
        { created_by: req.user._id },
        { _id: loadId },
        { status: 'NEW' },
      ],
    }, {
      address: {
        pickUp: pickUpAddress,
        delivery: deliveryAddress,
      },
      coord: {
        pickUp: {
          lat: pickUpCoords.latitude,
          lon: pickUpCoords.longitude,
        },
        delivery: {
          lat: deliveryCoords.latitude,
          lon: deliveryCoords.longitude,
        },
      },
      $push: {
        logs: {
          message: 'load coordinates updated',
        },
      },
    });

    res.status(200).json({ status: 'load coordinates updated' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/post
router.put('/post', valid(loadValid.post, 'body'), async (req, res) => {
  try {
    if (req.user.role === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadId } = req.body;

    if (!loadId) {
      return res.status(403).json({ status: 'Please fill in loadId' });
    }

    await Load.findOneAndUpdate({
      $and: [
        { created_by: req.user._id },
        { _id: loadId },
        { status: 'NEW' },
      ],
    }, {
      status: 'POSTED',
      $push: {
        logs: {
          message: 'load status POSTED',
        },
      },
    });

    res.status(200).json({ status: 'load posted' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/assign
router.put('/assign', valid(loadValid.assign, 'body'), async (req, res) => {
  try {
    const { loadId } = req.body;

    if (req.user.role === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const load = await Load.findOne({ _id: loadId });

    const truckType = findTruckType(load.dimensions, load.payload);

    const truckFound = await Truck.findOne({
      $and: [
        { assigned_to: { $ne: null } },
        { status: 'IS' },
        { type: truckType },
      ],
    });

    if (!truckFound) {
      const updatedLoad = await Load.findOneAndUpdate({
        _id: loadId,
      }, {
        status: 'NEW',
        $push: {
          logs: {
            message: 'truck not found, status returns to NEW',
          },
        },
      }, { new: true });

      return res.status(200).send(updatedLoad);
    }

    await Truck.findOneAndUpdate({
      _id: truckFound._id,
    }, {
      status: 'OL',
      $push: {
        logs: {
          message: 'truck status OL',
        },
      },
    });

    await Load.findOneAndUpdate({
      _id: loadId,
    }, {
      assigned_to: truckFound._id,
      status: 'ASSIGNED',
      state: 'En route to Pick Up',
      $push: {
        logs: {
          message: 'load assigned',
        },
      },
    });

    res.status(200).json({ status: 'load assigned' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/updateInfo
router.put('/updateInfo', valid(loadValid.updateInfo, 'body'), async (req, res) => {
  try {
    if (req.user.role === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadId, length, width, height, payload } = req.body;

    if (!loadId || !length || !width || !height || !payload) {
      return res.status(403).json({ status: 'Please fill in all the fields' });
    }

    await Load.findOneAndUpdate({
      $and: [
        { created_by: req.user._id },
        { _id: loadId },
        { status: 'NEW' },
      ],
    }, {
      dimensions: {
        length,
        width,
        height,
      },
      payload: payload,
      $push: {
        logs: {
          message: 'load updated',
        },
      },
    });

    res.status(200).json({ status: 'load updated' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/checkForLoad
router.get('/checkForLoad', async (req, res) => {
  try {
    if (req.user.role === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const assignedTruck = await Truck.findOne({
      assigned_to: req.user._id,
    });

    if (!assignedTruck) return res.status(200).json({ status: 'No truck assigned' });

    const loadFound = await Load.findOne({
      assigned_to: assignedTruck._id,
    });

    if (!loadFound) return res.status(200).json({ status: 'Nothing' });

    res.status(200).send(loadFound);
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/updateState
router.put('/updateState', valid(loadValid.updateState, 'body'), async (req, res) => {
  try {
    const { loadId, state } = req.body;

    if (req.user.role === 'shipper') {
      return res.status(403).json({ status: 'You are not a driver' });
    }

    await Load.findOneAndUpdate({
      _id: loadId,
    }, {
      state,
      $push: {
        logs: {
          message: `state updated: ${req.body.state}`,
        },
      },
    });

    res.status(200).json({ state });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/finish
router.put('/finish', valid(loadValid.finish, 'body'), async (req, res) => {
  try {
    const { loadId, state } = req.body;

    if (req.user.role === 'shipper') {
      return res.status(403).json({ status: 'You are not a driver' });
    }

    const shippedLoad = await Load.findOneAndUpdate({
      _id: loadId,
    }, {
      assigned_to: null,
      state: state,
      status: 'SHIPPED',
      $push: {
        logs: {
          message: 'load status SHIPPED',
        },
      },
    });

    await Truck.findOneAndUpdate({
      assigned_to: req.user._id,
    }, {
      status: 'IS',
      $push: {
        logs: {
          message: 'truck status IS',
        },
      },
    });

    res.status(200).send(shippedLoad);
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/assignedDriver
router.post('/assignedDriver', valid(loadValid.assignedDriver, 'body'), async (req, res) => {
  try {
    const { loadId } = req.body;

    const load = await Load.findOne({
      $and: [
        { _id: loadId },
        { assigned_to: { $ne: null } },
      ],
    });

    if (!load) return;

    const truck = await Truck.findOne({
      $and: [
        { _id: load.assigned_to },
        { assigned_to: { $ne: null } },
      ],
    });

    if (!truck) return;

    const driver = await User.findOne({
      _id: truck.assigned_to,
    });

    if (!driver) return;

    res.status(200).send(driver);
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/all
router.get('/all', async (req, res) => {
  try {
    const loads = await Load.find({});

    res.status(200).send(loads);
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/allForUser
router.get('/allForUser', async (req, res) => {
  try {
    const loads = await Load.find({ created_by: req.user._id });

    res.status(200).send(loads);
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/delete
router.delete('/delete', valid(loadValid.delete, 'body'), async (req, res) => {
  try {
    const { loadId } = req.body;

    if (req.user.role === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    await Load.findOneAndDelete({
      $and: [
        { created_by: req.user._id },
        { _id: loadId },
        { status: 'NEW' },
      ],
    });

    res.status(200).json({ status: 'load deleted' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/deleteAll
router.delete('/deleteAll', async (req, res) => {
  try {
    await Load.deleteMany({});

    res.status(200).json({ status: 'loads deleted' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

module.exports = router;
