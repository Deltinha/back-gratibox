import Joi from 'joi';

export default function validateBearerToken(bearerToken) {
  const bearerArray = bearerToken.split(' ');

  const schema = Joi.string().guid({ version: ['uuidv4'] });

  if (bearerArray.length !== 2 || bearerArray[0] !== 'Bearer') {
    return false;
  }

  const validation = schema.validate(bearerArray[1]);
  return !validation.error;
}
