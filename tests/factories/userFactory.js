import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../../src/database/database';

export default async function createUser() {
  const password = faker.internet.password();
  const user = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    hashedPassword: bcrypt.hashSync(password, 12),
  };

  const insertedUser = await connection.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [user.name, user.email, user.hashedPassword]
  );

  Object.assign(user, { id: insertedUser.rows[0].id });

  return user;
}
