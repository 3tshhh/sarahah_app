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
