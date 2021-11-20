const userSubscriptionSchema = expect.objectContaining({
  id: expect.any(Number),
  userId: expect.any(Number),
  plan: expect.any(String),
  subscriptionDate: expect.any(String),
  products: expect.arrayContaining([expect.any(String)]),
  nextDeliveries: expect.toBeArrayOfSize(3),
});

export { userSubscriptionSchema };
