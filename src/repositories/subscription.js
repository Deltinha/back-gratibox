import connection from '../database/database';

export async function getPlans() {
  const plans = await connection.query(`
      SELECT * FROM plans;
    `);
  return plans.rows;
}

export async function getDaysFromPlan(planId) {
  const days = await connection.query(
    `
      SELECT * FROM delivery_days where plan_id = $1;
    `,
    [planId]
  );
  return days.rows;
}

export async function getDayFromId(dayId) {
  const days = await connection.query(
    `
      SELECT * FROM delivery_days where id = $1;
    `,
    [dayId]
  );

  return days.rows;
}

export async function getProducts() {
  const products = await connection.query(`
      SELECT * FROM products;
    `);
  return products.rows;
}

export async function getStates() {
  const states = await connection.query(`
      SELECT * FROM states ORDER BY 2;
    `);
  return states.rows;
}

export async function insertSubscription({ body, userId }) {
  console.log(body);
  const { deliveryDayId, address, recipient, cep, city, stateId } = body;
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
    [address, recipient, cep, city, stateId]
  );

  await connection.query(
    `
    INSERT INTO SUBSCRIPTIONS (user_id, address_id, delivery_day_id) VALUES ($1, $2, $3);
    `,
    [userId, addressId.rows[0].id, deliveryDayId]
  );
}
