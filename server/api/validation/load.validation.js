const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object({
    loadName: Joi.string()
      .min(3)
      .max(30)
      .required(),

    length: Joi.number()
      .integer()
      .positive()
      .required(),

    width: Joi.number()
      .integer()
      .positive()
      .required(),

    height: Joi.number()
      .integer()
      .positive()
      .required(),

    payload: Joi.number()
      .integer()
      .positive()
      .required(),
  }),

  updateCoords: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),

    pickUpCoords: Joi.object().keys({
      latitude: Joi.number()
        .required(),

      longitude: Joi.number()
        .required(),
    }),

    deliveryCoords: Joi.object().keys({
      latitude: Joi.number()
        .required(),

      longitude: Joi.number()
        .required(),
    }),

    pickUpAddress: Joi.string()
      .required(),

    deliveryAddress: Joi.string()
      .required(),
  }),

  post: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),
  }),

  assign: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),
  }),

  updateInfo: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),

    length: Joi.number()
      .integer()
      .positive()
      .required(),

    width: Joi.number()
      .integer()
      .positive()
      .required(),

    height: Joi.number()
      .integer()
      .positive()
      .required(),

    payload: Joi.number()
      .integer()
      .positive()
      .required(),
  }),

  updateState: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),

    state: Joi.string()
      .required(),
  }),

  finish: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),

    state: Joi.string()
      .required(),
  }),

  assignedDriver: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),
  }),

  delete: Joi.object({
    loadId: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]+$'))
      .required(),
  }),
};
