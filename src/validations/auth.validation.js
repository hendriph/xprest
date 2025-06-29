const Joi = require('joi');

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullname: Joi.string().required(),
  role: Joi.required()
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.refreshTokenSchema = Joi.object({
  token: Joi.string().required()
});

exports.forgotSchema = Joi.object({
  email: Joi.string().email().required()
});

exports.resetSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});
