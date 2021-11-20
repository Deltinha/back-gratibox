import '../src/setup';
import supertest from 'supertest';
import app from '../src/app';
import connection from '../src/database/database';
import createUser from './factories/userFactory';
import createCredentials from './factories/credentialsFactory';

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

  it('returns 409 when email is already taken', async () => {
    const user = await createUser();

    const result = await agent
      .post('/register')
      .send({ name: user.name, email: user.email, password: user.password });
    expect(result.status).toEqual(409);
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

describe('POST /login', () => {
  afterAll(async () => {
    await connection.query('DELETE FROM sessions;');
    await connection.query('DELETE FROM users;');
  });

  it('returns 200 for valid credentials', async () => {
    const user = await createUser();

    const result = await agent
      .post('/login')
      .send({ email: user.email, password: user.password });
    expect(result.status).toEqual(200);
    expect(result.body).toMatchObject(
      expect.objectContaining({
        userId: expect.any(Number),
        token: expect.any(String),
        name: expect.any(String),
      })
    );
  });

  it('returns 400 for invalid joi validation', async () => {
    const user = await createUser();

    let result = await agent
      .post('/login')
      .send({ email: 'notAnEmail', password: user.password });
    expect(result.status).toEqual(400);
    result = await agent
      .post('/login')
      .send({ email: user.email, password: 'shortPw' });
    expect(result.status).toEqual(400);
  });

  it('returns 403 for inexistent email or wrong password', async () => {
    const user = await createUser();

    let result = await agent
      .post('/login')
      .send({ email: 'wrong@email.com', password: user.password });
    expect(result.status).toEqual(403);

    result = await agent
      .post('/login')
      .send({ email: user.email, password: 'wrongPass' });
    expect(result.status).toEqual(403);
  });
});

afterAll(async () => {
  connection.end();
});
