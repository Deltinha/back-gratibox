import '../src/setup';
import app from '../src/app';
import supertest from 'supertest';
import connection from '../src/database/database';
import createUser from './factories/userFactory';
import { plansSchema } from './schemas/plansSchema';
import { productsSchema } from './schemas/productsSchema';

const agent = supertest(app);

describe('GET /plans', () => {
  it('returns 200 for get on /plans', async () => {
    const result = await agent.get('/plans');

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(plansSchema);
  });
});

describe('GET /products', () => {
  it('returns 200 for get on /products', async () => {
    const result = await agent.get('/products');

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(productsSchema);
  });
});
