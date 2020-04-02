const { Schema, model, Types } = require('mongoose');

module.exports = model('Weather', new Schema({
    created_by: {type: Types.ObjectId, ref: 'User'},
    weather: {
        main: {type: String, default: ''},
        description: {type: String, default: ''},
        icon: {type: String, default: ''}
    },
    main: {                                                     
        temp: {type: Number, default: 0},                                                                 
        feels_like: {type: Number, default: 0},   
        pressure: {type: Number, default: 0},
        humidity: {type: Number, default: 0}
    },
    wind: {
        speed: {type: Number, default: 0},
        deg: {type: Number, default: 0}
    }
}));