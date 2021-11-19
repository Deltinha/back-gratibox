import '../src/setup';
import app from '../src/app';
import supertest from 'supertest';
import connection from '../src/database/database';
import createUser from './factories/userFactory';

const agent = supertest(app);

describe('GET /plans', () => {
  it('returns 200 for get on /plans', async () => {
    const result = await agent.get('/plans');

    expect(result.status).toEqual(200);

    expect(result.body).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });
});
