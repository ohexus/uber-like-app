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
    if (req.userRole === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadName, length, width, height, payload } = req.body;

    if (!loadName || !length || !width || !height || !payload) {
      return res.status(200).json({ status: 'Please fill in all the fields' });
    }

    const newLoad = new Load({
      created_by: req.userId,
      dimensions: {
        length,
        width,
        height,
      },
      payload,
      loadName,
    });

    await newLoad.save();

    req.io.emit('createLoad', newLoad);

    res.status(200).json({ newLoad });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/updateCoords
router.put('/updateCoords', valid(loadValid.updateCoords, 'body'), async (req, res) => {
  try {
    if (req.userRole === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadId, pickUpCoords, deliveryCoords, pickUpAddress, deliveryAddress } = req.body;

    if (!loadId || !pickUpCoords || !deliveryCoords) {
      return res.status(200).json({ status: 'Please fill in all fields' });
    }

    const updatedLoad = await Load.findOneAndUpdate({
      $and: [
        { created_by: req.userId },
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
    }, { new: true });

    req.io.emit('updateLoadInfo', updatedLoad);

    res.status(200).json({ status: 'load coordinates updated' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/post
router.put('/post', valid(loadValid.post, 'body'), async (req, res) => {
  try {
    if (req.userRole === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadId } = req.body;

    if (!loadId) {
      return res.status(403).json({ status: 'Please fill in loadId' });
    }

    const postedLoad = await Load.findOneAndUpdate({
      $and: [
        { created_by: req.userId },
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
    }, { new: true });

    req.io.emit('postLoad', postedLoad);

    res.status(200).json({ status: 'load posted' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/assign
router.put('/assign', valid(loadValid.assign, 'body'), async (req, res) => {
  try {
    const { loadId } = req.body;

    if (req.userRole === 'driver') {
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
      const assignedLoad = await Load.findOneAndUpdate({
        _id: loadId,
      }, {
        status: 'NEW',
        $push: {
          logs: {
            message: 'truck not found, status returns to NEW',
          },
        },
      }, { new: true });

      req.io.emit('assignLoad', assignedLoad);

      return res.status(200).json({ assignedLoad });
    }

    const updatedTruck = await Truck.findOneAndUpdate({
      _id: truckFound._id,
    }, {
      status: 'OL',
      $push: {
        logs: {
          message: 'truck status OL',
        },
      },
    });

    const assignedLoad = await Load.findOneAndUpdate({
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
    }, { new: true });

    req.io.emit('updateTruck', updatedTruck);
    req.io.emit('assignLoad', assignedLoad);
    req.io.emit('checkForLoad', assignedLoad);
    req.io.emit('ableUpdateProfile', {
      userId: updatedTruck.created_by,
      isAble: false,
    });

    const driver = await User.findOne({ _id: updatedTruck.assigned_to });

    req.io.emit('updateLoadDriverInfo', driver);

    res.status(200).json({ status: 'load assigned' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/updateInfo
router.put('/updateInfo', valid(loadValid.updateInfo, 'body'), async (req, res) => {
  try {
    if (req.userRole === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const { loadId, length, width, height, payload } = req.body;

    if (!loadId || !length || !width || !height || !payload) {
      return res.status(403).json({ status: 'Please fill in all the fields' });
    }

    const updatedLoad = await Load.findOneAndUpdate({
      $and: [
        { created_by: req.userId },
        { _id: loadId },
        { status: 'NEW' },
      ],
    }, {
      dimensions: {
        length,
        width,
        height,
      },
      payload,
      $push: {
        logs: {
          message: 'load updated',
        },
      },
    }, { new: true });

    req.io.emit('updateLoadInfo', updatedLoad);

    res.status(200).json({ status: 'load updated' });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/checkForLoad
router.get('/checkForLoad', async (req, res) => {
  try {
    if (req.userRole === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const assignedTruck = await Truck.findOne({
      assigned_to: req.userId,
    });

    if (!assignedTruck) return res.status(200).json({ status: 'No truck assigned' });

    const loadFound = await Load.findOne({
      assigned_to: assignedTruck._id,
    });

    if (!loadFound) return res.status(200).json({ status: 'No order load' });

    res.status(200).json({
      status: 'OK',
      load: loadFound,
    });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/updateState
router.put('/updateState', valid(loadValid.updateState, 'body'), async (req, res) => {
  try {
    const { loadId, state } = req.body;

    if (req.userRole === 'shipper') {
      return res.status(403).json({ status: 'You are not a driver' });
    }

    const updatedLoad = await Load.findOneAndUpdate({
      _id: loadId,
    }, {
      state,
      $push: {
        logs: {
          message: `state updated: ${req.body.state}`,
        },
      },
    }, { new: true });

    req.io.emit('updateLoadInfo', updatedLoad);
    req.io.emit('updateLoadState', updatedLoad);

    res.status(200).json({ updatedLoad });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/finish
router.put('/finish', valid(loadValid.finish, 'body'), async (req, res) => {
  try {
    const { loadId, state } = req.body;

    if (req.userRole === 'shipper') {
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
    }, { new: true });

    const updatedTruck = await Truck.findOneAndUpdate({
      assigned_to: req.userId,
    }, {
      status: 'IS',
      $push: {
        logs: {
          message: 'truck status IS',
        },
      },
    }, { new: true });

    req.io.emit('updateLoadInfo', shippedLoad);
    req.io.emit('updateLoadState', shippedLoad);
    req.io.emit('updateTruck', updatedTruck);
    req.io.emit('ableUpdateProfile', {
      userId: updatedTruck.created_by,
      isAble: true,
    });

    res.status(200).json({ status: 'load shipped' });
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

    if (!load) return res.status(200).json({ status: 'No load' });

    const truck = await Truck.findOne({
      $and: [
        { _id: load.assigned_to },
        { assigned_to: { $ne: null } },
      ],
    });

    if (!truck) return res.status(200).json({ status: 'No truck' });

    const driver = await User.findOne({
      _id: truck.assigned_to,
    });

    if (!driver) return res.status(200).json({ status: 'No driver' });

    res.status(200).json({ driver });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/all
router.get('/all', async (req, res) => {
  try {
    const loads = await Load.find({});

    res.status(200).json({ loads });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/allForUser
router.get('/allForUser', async (req, res) => {
  try {
    const loads = await Load.find({ created_by: req.userId });

    res.status(200).json({ loads });
  } catch (e) {
    res.status(500).json({ status: e.message });
  }
});

// api/load/delete
router.delete('/delete', valid(loadValid.delete, 'body'), async (req, res) => {
  try {
    const { loadId } = req.body;

    if (req.userRole === 'driver') {
      return res.status(403).json({ status: 'You are not a shipper' });
    }

    const deletedLoad = await Load.findOneAndDelete({
      $and: [
        { created_by: req.userId },
        { _id: loadId },
        { status: 'NEW' },
      ],
    });

    req.io.emit('deleteLoad', deletedLoad);

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
