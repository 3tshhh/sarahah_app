import Joi from "joi";
import { GenderEnum } from "../../Common/enums/user.enum.js";

//{ firstName, lastName, email, password, gender, age, phone }
export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).alphanum().required().messages({
        'string.alphanum': 'first name must only contain alpha-numeric characters',
        'string.empty': 'first name cannot be an empty field',
        'string.min': 'first name should have a minimum length of {#limit}',
        'string.max': 'first name should have a maximum length of {#limit}',
        'any.required': 'first name is a required field'
    }),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/,).required().messages({
        'string.pattern.base': 'password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
        'string.empty': 'password cannot be an empty field',
        'any.required': 'password is a required field'
    }),
    confirmPassword:Joi.string().valid(Joi.ref('password')).required().messages({'any.only':'confirm password does not match'}),
    gender: Joi.string().valid(...Object.values(GenderEnum)).optional(),
    age: Joi.number().min(13).max(120).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
  }),
//   query: Joi.object({}),
};
