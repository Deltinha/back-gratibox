import '../src/setup';
import app from '../src/app';
import supertest from 'supertest';
import connection from '../src/database/database';
import createUser from './factories/userFactory';
import { plansSchema } from './schemas/plansSchema';
import { productsSchema } from './schemas/productsSchema';
import { statesSchema } from './schemas/statesSchema';

const agent = supertest(app);

describe('Create subscription test suit', () => {
  it('returns 200 for get on /plans', async () => {
    const result = await agent.get('/plans');

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(plansSchema);
  });

  it('returns 200 for get on /states', async () => {
    const result = await agent.get('/states');

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(statesSchema);
  });

  it('returns 200 for get on /products', async () => {
    const result = await agent.get('/products');

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(productsSchema);
  });
});
