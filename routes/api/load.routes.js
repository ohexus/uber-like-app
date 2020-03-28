const router = require('express').Router();

const Load = require('../../models/Load');
const Truck = require('../../models/Truck');

const findTruckType = require('../../helpers/findTruckType');

// Load Schema
// created_by: {type: Types.ObjectId, ref: 'User'},
// assigned_to: {type: Types.ObjectId, ref: 'User', default: null},
// status: {type: String, default: 'NEW'},
// state: {type: String, default: null},
// dimensions: {
//     width: Number,
//     length: Number,
//     height: Number
// },
// payload: Number

// api/load/create
router.post('/create', async (req, res) => {
    try {
        if (req.user.role === 'driver') {
            return res.status(401).json({ status: 'You are not a shipper' });
        }

        const { length, width, height, payload } = req.body;

        if ( !length || !width || !height || !payload ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        if (req.user.role === 'driver') {
            return res.status(401).json({ status: 'You are not a shipper' });
        }
        
        const load = new Load({
            created_by: req.user._id,
            dimensions: {
                length: length,
                width: width,
                height: height
            },
            payload: payload
        });
        
        await load.save();

        res.status(200).send(load);

        console.log('Load saved successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/post
router.put('/post', async (req, res) => {
    try {
        if (req.user.role === 'driver') {
            return res.status(401).json({ status: 'You are not a shipper' });
        }

        const { loadId } = req.body;

        if (!loadId) {
            return res.status(401).json({ status: 'Please fill in loadId' });
        }

        await Load.findOneAndUpdate(
            { $and: [
                { created_by: req.user._id },
                { _id: loadId },
                { status: 'NEW' }
            ]},
            {
                status: 'POSTED'
            }
        );    

        res.status(200).json({ status: 'load posted' });

        console.log('Load posted successfully');
    
    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/assign
router.put('/assign', async (req, res) => {
    try {
        if (req.user.role === 'driver') {
            return res.status(401).json({ status: 'You are not a shipper' });
        }

        const load = await Load.findOne({ _id: req.body.loadId });

        const truckType = findTruckType(load.dimensions, load.payload);

        const truckFound = await Truck.findOne(
            { $and: [
                { assigned_to: {$ne: null} },
                { status: 'IS' },
                { type: truckType }
            ]}
        );

        if (!truckFound) {
            return res.status(401).json({ status: 'All matched trucks is on load, try again later' });
        }

        await Truck.findOneAndUpdate(
            { 
                _id: truckFound._id 
            },
            {
                status: 'OL'
            }
        );

        await Load.findOneAndUpdate(
            { 
                _id: req.body.loadId
            },
            { 
                assigned_to: truckFound._id,
                status: 'ASSIGNED',
                state: 'En route to Pick Up'
            }
        );

        res.status(200).json({ status: 'load assigned' });

        console.log('Load assigned successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/update
router.put('/update', async (req, res) => {
    try {
        if (req.user.role === 'driver') {
            return res.status(401).json({ status: 'You are not a shipper' });
        }
        
        const { loadId, length, width, height, payload } = req.body;

        if ( !loadId || !length || !width || !height || !payload ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        await Load.findOneAndUpdate(
            { $and: [
                { created_by: req.user._id },
                { _id: loadId },
                { status: 'NEW' }
            ]},
            {
                dimensions: {
                    length: length,
                    width: width,
                    height: height
                },
                payload: payload
            }
        );    

        res.status(200).json({ status: 'load updated' });

        console.log('Load updated successfully');
    
    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/delete
router.delete('/delete', async (req, res) => {
    try {
        if (req.user.role === 'driver') {
            return res.status(401).json({ status: 'You are not a shipper' });
        }
        
        await Load.findOneAndDelete(
            { $and: [
                { created_by: req.user._id },
                { _id: req.body.loadId },
                { status: 'NEW' }
            ]}
        );

        res.status(200).json({ status: 'load deleted' });

        console.log('Load deleted successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/all
router.get('/all', async (req, res) => {
    try {
        const loads = await Load.find({ created_by: req.user._id });

        res.status(200).json({ loads: loads });

        console.log(`loads: ${loads}`);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/arrivedtopickup
router.put('/arrivedtopickup', async (req, res) => {
    try {
        if (req.user.role === 'shipper') {
            return res.status(401).json({ status: 'You are not a driver' });
        }
        
        await Load.findOneAndUpdate(
            { 
                _id: req.body.loadId 
            },
            {
                state: 'Arrived to Pick Up'
            }
        );

        res.status(200).json({ state: 'Arrived to Pick Up' });

        console.log('Arrived to Pick Up');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/enroutetodelivery
router.put('/enroutetodelivery', async (req, res) => {
    try {
        if (req.user.role === 'shipper') {
            return res.status(401).json({ status: 'You are not a driver' });
        }
        
        await Load.findOneAndUpdate(
            { 
                _id: req.body.loadId 
            },
            {
                state: 'En route to Delivery'
            }
        );

        res.status(200).json({ state: 'En route to Delivery' });

        console.log('En route to Delivery');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/load/arrivedtodelivery
router.put('/arrivedtodelivery', async (req, res) => {
    try {
        if (req.user.role === 'shipper') {
            return res.status(401).json({ status: 'You are not a driver' });
        }
        
        const load = await Load.findOneAndUpdate(
            { 
                _id: req.body.loadId 
            },
            {
                status: 'SHIPPED',
                state: 'Arrived to Delivery'
            }
        );

        await Truck.findOneAndUpdate(
            {
                _id: load.assigned_to
            },
            {
                status: 'IS'
            }
        );

        res.status(200).json({ state: 'Arrived to Delivery' });

        console.log('Arrived to Delivery');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;