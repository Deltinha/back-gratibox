import '../src/setup';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import app from '../src/app';
import connection from '../src/database/database';
import createUser from './factories/userFactory';
import { plansSchema } from './schemas/plansSchema';
import { productsSchema } from './schemas/productsSchema';
import { statesSchema } from './schemas/statesSchema';
import { createSession } from './factories/sessionFactory';
import createAddress from './factories/addressFactory';
import createPlan from './factories/planFactory';
import { createSubscription } from './factories/subscriptionFactory';
import { userSubscriptionSchema } from './schemas/userSubscriptionSchema';

async function clearDatabase() {
  await connection.query('DELETE FROM sessions;');
  await connection.query('DELETE FROM products_subscriptions;');
  await connection.query('DELETE FROM subscriptions;');
  await connection.query('DELETE FROM users;');
  await connection.query('DELETE FROM delivery_days;');
  await connection.query('DELETE FROM plans;');
  await connection.query('DELETE FROM addresses;');
  await connection.query('DELETE FROM states;');
}

const agent = supertest(app);

describe('Create subscription test suit', () => {
  beforeEach(async () => {
    await createPlan();
    await createAddress();
  });

  afterEach(async () => {
    await clearDatabase();
  });
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

describe('GET /user plan test suit', () => {
  beforeAll(async () => {});
  afterAll(async () => {
    await clearDatabase();
  });
  it('returns 204 if user is not subscribed', async () => {
    const user = await createUser();

    const token = await createSession(user.id);

    const result = await agent
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(204);
  });
  it('returns 401 if auth is invalid', async () => {
    const user = await createUser();

    const token = await createSession(user.id);

    let result = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer token123`);
    expect(result.status).toEqual(401);

    result = await supertest(app).get('/user').set('Authorization', `${token}`);
    expect(result.status).toEqual(401);

    result = await supertest(app)
      .get('/user')
      .set('Authorization', `Random ${token}`);
    expect(result.status).toEqual(401);

    result = await supertest(app)
      .get('/user')
      .set('Authorization', `${uuid()}`);
    expect(result.status).toEqual(401);
  });
  it('returns 401 if user is unlogged', async () => {
    await createUser();

    const result = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer ${uuid()}`);
    expect(result.status).toEqual(401);
  });
  it('returns 200 for get on /plans', async () => {
    const user = await createUser();
    const token = await createSession(user.id);
    await createSubscription(user.id);

    const result = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(userSubscriptionSchema);
  });
});

afterAll(async () => {
  connection.end();
});
