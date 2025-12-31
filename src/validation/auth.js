import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  surname: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  surname: Joi.string().min(3).max(30),
  password: Joi.string().min(6),
  gender: Joi.string(),
  birthDate: Joi.date().iso().optional(),
});
