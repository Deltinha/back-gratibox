const plansSchema = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(Number),
    name: expect.any(String),
    days: expect.arrayContaining([
      expect.objectContaining({
        day: expect.any(Number),
        deliveryDayId: expect.any(Number),
      }),
    ]),
  }),
]);

export { plansSchema };
