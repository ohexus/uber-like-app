const { Schema, model, Types } = require('mongoose');

// load statuses
// NEW
// POSTED
// ASSIGNED
// SHIPPED

// load state transitions
// En route to Pick Up
// Arrived to Pick Up
// En route to Delivery
// Arrived to Delivery

module.exports = model('Load', new Schema({
    created_by: { type: Types.ObjectId, ref: 'User' },
    logs: [{
        message: { type: String, default: 'Load created' },
        time: { type: Date, default: Date.now() }
    }],
    assigned_to: { type: Types.ObjectId, ref: 'Truck', default: null },
    status: { type: String, default: 'NEW' },
    state: { type: String, default: null },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    payload: Number,
    loadName: String,
    address: {
        pickUp: { type: String, default: null },
        delivery: { type: String, default: null }
    },
    coord: {
        pickUp: {
            lat: { type: Number, default: null },
            lon: { type: Number, default: null }
        },
        delivery: {
            lat: { type: Number, default: null },
            lon: { type: Number, default: null }
        }
    }
}));