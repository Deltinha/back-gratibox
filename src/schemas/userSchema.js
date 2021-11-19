import Joi from 'joi';

export function validadeNewUserSyntax(obj) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
  });

  const validation = schema.validate(obj);
  return !validation.error;
}

export function validadeLoginSyntax(obj) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
  });

  const validation = schema.validate(obj);
  return !validation.error;
}
