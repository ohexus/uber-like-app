const router = require('express').Router();

const User = require('../../models/User');
const Truck = require('../../models/Truck');

// api/truck/create
router.post('/create', async (req, res) => {
    console.log('create');
    try {
        const { truckName, brand, model, carrying, length, width, height } = req.body;

        if ( !truckName || !brand || !model || !carrying || !length || !width || !height ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        const truckNameFound = await Truck.findOne({ $and: [
            { owner: req.user._id },
            { truckName: truckName }
        ]});

        if (truckNameFound) {
            return res.status(401).json({ status: 'Please choose another truck name' });
        }
        
        const truck = new Truck({
            owner: req.user._id,
            truckName: truckName,
            brand: brand,
            model: model,
            carrying: carrying,
            length: length,
            width: width,
            height: height
        });
        
        await truck.save();

        res.status(200).json({ truckId: truck._id });

        console.log('Truck saved successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/truck/assign
router.put('/assign', async (req, res) => {
    try {
        await Truck.updateMany(
            { owner: req.user._id },
            { isAssigned: false }
        );

        await Truck.findOneAndUpdate(
            { $and: [
                { owner: req.user._id },
                { truckName: req.body.truckName }
            ]},
            { isAssigned: true }
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
        const { truckName, brand, model, carrying, length, width, height } = req.body;

        if ( !truckName || !brand || !model || !carrying || !length || !width || !height ) {
            return res.status(401).json({ status: 'Please fill in all the fields' });
        }

        await Truck.findOneAndUpdate(
            { $and: [
                { owner: req.user._id },
                { truckName: truckName },
                { isAssigned: false }
            ]},
            {
                brand: brand,
                model: model,
                carrying: carrying,
                length: length,
                width: width,
                height: height
            },
            (err) => {
                if (err) {
                    res.status(500).json({ status: 'failed to update' });
                }
        });    

        res.status(200).json({ status: 'truck updated' });

        console.log('Truck updated successfully');
    
    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/truck/delete
router.delete('/delete', async (req, res) => {
    try {
        await Truck.findOneAndDelete(
            { $and: [
                { owner: req.user._id },
                { truckName: req.body.truckName },
                { isAssigned: false }
            ]}, 
            (err) => {
                if (err) {
                    res.status(500).json({ status: 'failed to delete' });
                }
        });

        res.status(200).json({ status: 'truck deleted' });

        console.log('Truck deleted successfully');

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

// api/truck/all
router.get('/all', async (req, res) => {
    try {
        const trucks = await Truck.find({ owner: req.user._id });

        res.status(200).json({ trucks: trucks });

        console.log(`trucks: ${trucks}`);

    } catch (e) {
        res.status(500).json({ status: e.message });
    }
});

module.exports = router;