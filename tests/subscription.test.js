import '../src/setup';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import faker from 'faker';
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
import createProduct from './factories/productsFactory';

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

describe('GET options', () => {
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

    let result = await agent
      .get('/user')
      .set('Authorization', `Bearer not-a-token`);
    expect(result.status).toEqual(401);

    result = await agent.get('/user').set('Authorization', `${token}`);
    expect(result.status).toEqual(401);

    result = await agent
      .get('/user')
      .set('Authorization', `not-bearer ${token}`);
    expect(result.status).toEqual(401);

    result = await agent.get('/user').set('Authorization', `${uuid()}`);
    expect(result.status).toEqual(401);
  });
  it('returns 401 if user is unlogged', async () => {
    await createUser();

    const result = await agent
      .get('/user')
      .set('Authorization', `Bearer ${uuid()}`);
    expect(result.status).toEqual(401);
  });
  it('returns 200 is user is subscribed', async () => {
    const user = await createUser();
    const token = await createSession(user.id);
    await createSubscription(user.id);

    const result = await agent
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(userSubscriptionSchema);
  });
});

describe('POST /subscription test suit', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  it('returns 201 subscription created', async () => {
    const user = await createUser();
    const token = await createSession(user.id);
    const deliveryDayId = await createPlan();
    const state = await connection.query(
      `
      INSERT INTO states
        (name)
      VALUES
        ('PI')
      RETURNING *;
      `
    );
    const stateId = state.rows[0].id;
    const productsIds = [await createProduct(), await createProduct()];

    const body = {
      deliveryDayId,
      address: faker.address.streetName(),
      recipient: faker.name.findName(),
      cep: '64000000',
      city: faker.address.cityName(),
      stateId,
      productsIds,
    };

    const subscription = await agent
      .post('/subscription')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect(subscription.status).toEqual(201);
  });

  it('returns 401 if auth is invalid', async () => {
    const user = await createUser();
    const token = await createSession(user.id);
    const deliveryDayId = await createPlan();
    const state = await connection.query(
      `
      INSERT INTO states
        (name)
      VALUES
        ('PI')
      RETURNING *;
      `
    );
    const stateId = state.rows[0].id;
    const productsIds = [await createProduct(), await createProduct()];

    const body = {
      deliveryDayId,
      address: faker.address.streetName(),
      recipient: faker.name.findName(),
      cep: '64000000',
      city: faker.address.cityName(),
      stateId,
      productsIds,
    };

    let subscription = await agent
      .post('/subscription')
      .set('Authorization', `Bearer not-a-token`)
      .send(body);
    expect(subscription.status).toEqual(401);

    subscription = await agent
      .post('/subscription')
      .set('Authorization', `Bearer ${uuid()}`)
      .send(body);
    expect(subscription.status).toEqual(401);

    subscription = await agent
      .post('/subscription')
      .set('Authorization', `${token}`)
      .send(body);
    expect(subscription.status).toEqual(401);

    subscription = await agent
      .post('/subscription')
      .set('Authorization', `not-bearer ${token}`)
      .send(body);
    expect(subscription.status).toEqual(401);
  });

  it('returns 400 if body is invalid', async () => {
    const user = await createUser();
    const token = await createSession(user.id);

    const body = {
      address: faker.address.streetName(),
      recipient: faker.name.findName(),
      city: faker.address.cityName(),
    };

    const subscription = await agent
      .post('/subscription')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect(subscription.status).toEqual(400);
  });

  it('returns 401 if user is unlogged', async () => {
    const deliveryDayId = await createPlan();
    const state = await connection.query(
      `
      INSERT INTO states
        (name)
      VALUES
        ('PI')
      RETURNING *;
      `
    );
    const stateId = state.rows[0].id;
    const productsIds = [await createProduct(), await createProduct()];

    const body = {
      deliveryDayId,
      address: faker.address.streetName(),
      recipient: faker.name.findName(),
      cep: '64000000',
      city: faker.address.cityName(),
      stateId,
      productsIds,
    };

    const subscription = await agent
      .post('/subscription')
      .set('Authorization', `Bearer ${uuid()}`)
      .send(body);
    expect(subscription.status).toEqual(401);
  });

  it('returns 403 if user is already subscribed', async () => {
    const user = await createUser();
    const token = await createSession(user.id);

    const deliveryDayId = await createPlan();
    const state = await connection.query(
      `
      INSERT INTO states
        (name)
      VALUES
        ('PI')
      RETURNING *;
      `
    );
    const stateId = state.rows[0].id;
    const productsIds = [await createProduct(), await createProduct()];

    const body = {
      deliveryDayId,
      address: faker.address.streetName(),
      recipient: faker.name.findName(),
      cep: '64000000',
      city: faker.address.cityName(),
      stateId,
      productsIds,
    };

    await agent
      .post('/subscription')
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    const subscription = await agent
      .post('/subscription')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect(subscription.status).toEqual(403);
  });
});

afterAll(async () => {
  connection.end();
});
