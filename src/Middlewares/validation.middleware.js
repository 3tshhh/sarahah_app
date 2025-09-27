/**
signUpSchema = {
     body: Joi.object({
         firstName: Joi.string().min(3).max(30).required(),
         lastName: Joi.string().min(3).max(30).required(),
         email: Joi.string().email().required(),
         password: Joi.string().min(6).max(30).required(),
         gender: Joi.string().valid("male", "female", "other").required(),
         age: Joi.number().min(13).max(120).required(),
         phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
 
     })
}
*/

const reqKeys = ["body", "params", "query", "headers"];
export const valitationMiddleware = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];
    for (const key of reqKeys) {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (error) {
          validationErrors.push(...error.details);
        }
      }
    }

    if (validationErrors.length) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validationErrors });
    }
    next();
  };
};
