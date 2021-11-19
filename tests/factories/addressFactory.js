import faker from 'faker';
import connection from '../../src/database/database';

export default async function createAddress() {
  const stateId = await connection.query(
    `
      INSERT INTO states
        (name)
      VALUES
        ('PI')
      RETURNING *;
  `
  );

  const addressId = await connection.query(
    `
    INSERT INTO addresses (
      address,
      recipient,
      cep,
      city,
      state_id
      )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `,
    [
      faker.address.streetName(),
      faker.name.findName(),
      '64000000',
      faker.address.city(),
      stateId.rows[0].id,
    ]
  );

  return addressId.rows[0].id;
}
