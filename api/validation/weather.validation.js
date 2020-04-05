const Joi = require('@hapi/joi');

module.exports = {
    update: Joi.object({
        lat: Joi.number()
            .required(),

        lon: Joi.number()
            .required()
    })
};