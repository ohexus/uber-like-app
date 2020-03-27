const { Schema, model, Types } = require('mongoose');

// truck types
// sprinter (300 x 250 x 170, 1700)
// small straight (500 x 250 x 170, 2500)
// large straight (700 x 350 x 200, 4000)

// truck statuses
// in service (IS)
// on load (OL)

module.exports = model('Truck', new Schema({
    created_by: {type: Types.ObjectId, ref: 'User'},
    assigned_to: {type: Types.ObjectId, ref: 'User', default: null},
    status: {type: String, default: 'IS'},
    type: String,
    truckName: String,
    brand: String,
    model: String
}));