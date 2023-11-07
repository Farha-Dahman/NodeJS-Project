import Joi from 'joi';

export const signupSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required().min(5).messages({
    'any.required': 'Email is required',
    'string.email': 'Plz enter a valid email',
    'string.min': 'Email length must be at least 5 characters',
  }),
  password: Joi.string().min(5).required().messages({
    'any.required': 'password is required',
  }),
  cPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password is not same as password',
    'any.required': 'Confirm password is required',
  }),
  photo: Joi.string().allow(null),
  phone: Joi.string().max(20).allow(null),
  jobTitle: Joi.string().max(100).default('Unknown').allow(null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().min(5).messages({
    'string.email': 'Plz enter a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(5).required().messages({
    'any.required': 'Password is required',
  }),
});
