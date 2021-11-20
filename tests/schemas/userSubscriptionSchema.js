const userSubscriptionSchema = expect.objectContaining({
  id: expect.any(Number),
  user_id: expect.any(Number),
  plan: expect.any(String),
  subscription_date: expect.any(String),
  products: expect.arrayContaining([expect.any(String)]),
  nextDeliveries: expect.toBeArrayOfSize(3),
});

export { userSubscriptionSchema };
