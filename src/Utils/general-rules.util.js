import Joi from "joi";
import { isValidObjectId } from "mongoose";

function objectValidation(value, helpers) {
  return isValidObjectId(value) ? value : helpers.message("invalid object id");
}

export const generalRules = {
  _id: Joi.string().custom(objectValidation),
  email: Joi.string().email(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character",
      "string.empty": "password cannot be an empty field",
      "any.required": "password is a required field",
    }),
};
