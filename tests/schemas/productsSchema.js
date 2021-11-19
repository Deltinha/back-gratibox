const productsSchema = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(Number),
    name: expect.any(String),
  }),
]);

export { productsSchema };
