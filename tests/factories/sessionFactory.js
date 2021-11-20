import { v4 as uuid } from 'uuid';
import connection from '../../src/database/database';

export async function createSession(userId) {
  const token = uuid();
  await connection.query(
    `INSERT INTO sessions (user_id, token) VALUES (${userId}, '${token}');
    `
  );
  return token;
}
