const Joi = require('joi');

exports.createSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  role: Joi.required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  address: Joi.string().optional()
});

exports.updateSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  role: Joi.required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  address: Joi.string().optional()
});
