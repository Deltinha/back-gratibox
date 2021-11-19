import Joi from 'joi';

export default function validateSubscriptionSyntax(obj) {
  const schema = Joi.object({
    deliveryDayId: Joi.number().required(),
    address: Joi.string().min(3).required(),
    recipient: Joi.string().min(3).required(),
    cep: Joi.string().length(8).required(),
    city: Joi.string().min(3).required(),
    stateId: Joi.number().required(),
    productsIds: Joi.array().items(Joi.number()).required(),
  });

  const validation = schema.validate(obj);
  return !validation.error;
}
