const Joi = require('@hapi/joi');

module.exports = {
  recover: Joi.object({
    userId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),

    newPassword: Joi.string()
      .min(3)
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%&*]{3,25}$'))
      .required(),
  }),

  checkUser: Joi.object({
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

    mobileNumber: Joi.number()
      .integer()
      .required(),
  }),
};
