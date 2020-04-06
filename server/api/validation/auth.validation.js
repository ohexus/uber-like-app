const Joi = require('@hapi/joi');

module.exports = {
    signup: Joi.object({
        firstName: Joi.string()
            .min(3)
            .max(30)
            .required(),

        lastName: Joi.string()
            .min(3)
            .max(30)
            .required(),

        username: Joi.string()
            .min(3)
            .max(30)
            .required(),

        email: Joi.string()
            .pattern(new RegExp('^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$'))
            .required(),

        password: Joi.string()
            .min(3)
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%&*]{3,25}$'))
            .required(),

        mobileNumber: Joi.number()
            .integer()
            .required(),

        role: Joi.string()
            .valid('shipper', 'driver')
            .required()
    }),

    login: Joi.object({
        login: Joi.string()
            .required(),

        password: Joi.string()
            .min(3)
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%&*]{3,25}$'))
            .required()
    }),
};