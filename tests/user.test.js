import '../src/setup';
import supertest from 'supertest';
import app from '../src/app';
import connection from '../src/database/database';
import { createCredentials, createUser } from './factories/userFactory';

const agent = supertest(app);

describe('POST /register', () => {
  afterEach(async () => {
    await connection.query('DELETE FROM users;');
  });

  it('returns 200 for valid credentials', async () => {
    const user = createCredentials();

    const result = await agent
      .post('/register')
      .send({ name: user.name, email: user.email, password: user.password });
    expect(result.status).toEqual(201);
  });

  it('returns 403 when email is already taken', async () => {
    const user = await createUser();

    const result = await agent
      .post('/register')
      .send({ name: user.name, email: user.email, password: user.password });
    expect(result.status).toEqual(403);
  });

  it('returns 400 for invalid credentials', async () => {
    const user = createCredentials();

    let result = await agent
      .post('/register')
      .send({ name: 'Us', email: user.email, password: user.password });
    expect(result.status).toEqual(400);

    result = await agent
      .post('/register')
      .send({ name: user.name, email: 'notAnEmail', password: user.password });
    expect(result.status).toEqual(400);

    result = await agent
      .post('/register')
      .send({ name: user.name, email: user.email, password: 'shortPw' });
    expect(result.status).toEqual(400);
  });
});

afterAll(async () => {
  await connection.query('DELETE FROM users;');
  connection.end();
});
