const router = require('express').Router();

const Truck = require('../../models/Truck');

// Truck Schema
// created_by: {type: Types.ObjectId, ref: 'User'},
// assigned_to: {type: Types.ObjectId, ref: 'User', default: ''},
// status: {type: String, default: 'IS'},
// type: String,
// truckName: String,
// brand: String,
// model: String

// api/truck/create
router.post('/create', async (req, res) => {
    try {
        if (req.user.role === 'shipper') {
            return res.status(401).json({ status: 'You are not a driver' });
        }
        
        const { type, truckName, brand, model } = req.body;

        if ( !type || !truckName || !brand || !model ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        const truckNameFound = await Truck.findOne({ $and: [
            { created_by: req.user._id },
            { truckName: truckName }
        ]});

        if (truckNameFound) {
            return res.status(401).json({ status: 'This truck name is already exist' });
        }
        
        const truck = new Truck({
            created_by: req.user._id,
            type: type,
            truckName: truckName,
            brand: brand,
            model: model
        });
        
        await truck.save();

        res.status(200).send(truck);

        console.log('Truck saved successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/truck/assign
router.put('/assign', async (req, res) => {
    try {
        if (!req.body.truckId) {
            return res.status(401).json({ status: 'Truck id undefined' });
        }

        if (req.user.role === 'shipper') {
            return res.status(401).json({ status: 'You are not a driver' });
        }
        
        await Truck.updateMany(
            { created_by: req.user._id },
            { assigned_to: null }
        );

        await Truck.findOneAndUpdate(
            { $and: [
                { created_by: req.user._id },
                { _id: req.body.truckId }
            ]},
            { assigned_to: req.user._id }
        );

        res.status(200).json({ status: 'truck assigned' });

        console.log('Truck assigned successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/truck/update
router.put('/update', async (req, res) => {
    try {
        if (req.user.role === 'shipper') {
            return res.status(401).json({ status: 'You are not a driver' });
        }
        
        const { truckId, type, truckName, brand, model } = req.body;

        if ( !truckId || !type || !truckName || !brand || !model ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        await Truck.findOneAndUpdate(
            { $and: [
                { created_by: req.user._id },
                { _id: truckId },
                { assigned_to: null }
            ]},
            {
                type: type,
                truckName: truckName,
                brand: brand,
                model: model
            }
        );    

        res.status(200).json({ status: 'truck updated' });

        console.log('Truck updated successfully');
    
    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/truck/delete
router.delete('/delete', async (req, res) => {
    try {
        if (!req.body.truckId) {
            return res.status(401).json({ status: 'Truck id undefined' });
        }

        if (req.user.role === 'shipper') {
            return res.status(401).json({ status: 'You are not a driver' });
        }
        
        await Truck.findOneAndDelete(
            { $and: [
                { created_by: req.user._id },
                { _id: req.body.truckId },
                { assigned_to: null }
            ]}
        );

        res.status(200).json({ status: 'truck deleted' });

        console.log('Truck deleted successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/truck/all
router.get('/all', async (req, res) => {
    try {
        const trucks = await Truck.find({ created_by: req.user._id });

        res.status(200).send(trucks);

        console.log(`trucks: ${trucks}`);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;