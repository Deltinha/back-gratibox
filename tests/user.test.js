import '../src/setup';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app';
import connection from '../src/database/database';

describe('POST /register', () => {
  it('returns 201 for valid body', async () => {
    const body = {
      name: 'user',
      email: 'user@gmail.com',
      password: '12345678',
    };

    const result = await supertest(app).post('/register').send(body);
    expect(result.status).toEqual(201);
  });
});
