import Joi from "joi";
import { GenderEnum } from "../../Common/enums/user.enum.js";
import { generalRules } from "../../Utils/index.js";

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).alphanum().required().messages({
      "string.alphanum":
        "first name must only contain alpha-numeric characters",
      "string.empty": "first name cannot be an empty field",
      "string.min": "first name should have a minimum length of {#limit}",
      "string.max": "first name should have a maximum length of {#limit}",
      "any.required": "first name is a required field",
    }),
    lastName: Joi.string().min(3).max(30).required(),
    email: generalRules.email.required(),
    password: generalRules.password,
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "confirm password does not match" }),
    gender: Joi.string()
      .valid(...Object.values(GenderEnum))
      .optional(),
    age: Joi.number().min(13).max(120).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }),
};

export const confirmEmailSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    otp: Joi.string().pattern(/^[0-9][a-z][A-Z]{6,6}$/).required(),
  }),
};

export const resendOTPSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
  }),
};
export const resetPasswordSchema = {
  body: Joi.object({
    newPassword: generalRules.password,
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "confirm password does not match" }),
  }),
};

const updatePasswordSchema = resetPasswordSchema
updatePasswordSchema.body.currentPassword =  generalRules.password.required()

export { updatePasswordSchema };


export const updateProfileSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).alphanum().optional(),
    lastName: Joi.string().min(3).max(30).optional(),
    email: generalRules.email.optional(),
    gender: Joi.string()
      .valid(...Object.values(GenderEnum))
      .optional(),
    age: Joi.number().min(13).max(120).optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  }),
};


