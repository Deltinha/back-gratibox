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

export async function getProductsByMultipleIds(productsIds) {
  let searchQuery = `
  SELECT * FROM products
    WHERE
  `;
  const paramArray = [];

  productsIds.forEach((productId, index) => {
    searchQuery += ` id=$${index + 1} OR`;
    paramArray.push(productId);
  });

  searchQuery = searchQuery.slice(0, -2);
  const products = await connection.query(searchQuery, paramArray);
  return products.rows;
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

async function insertProductsSubscriptions({ productsIds, subscriptionId }) {
  let insertQuery = `
  INSERT INTO products_subscriptions
    (product_id, subscription_id)
  VALUES
  `;

  productsIds.forEach((productId) => {
    insertQuery += `(${productId}, ${subscriptionId}),`;
  });

  insertQuery = insertQuery.slice(0, -1);
  await connection.query(insertQuery);
}

export async function insertSubscription(body) {
  const {
    deliveryDayId,
    address,
    recipient,
    cep,
    city,
    stateId,
    userId,
    productsIds,
  } = body;
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

  const subscription = await connection.query(
    `
    INSERT INTO subscriptions (
      user_id,
      address_id,
      delivery_day_id
    )
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [userId, addressId.rows[0].id, deliveryDayId]
  );

  insertProductsSubscriptions({
    productsIds,
    subscriptionId: subscription.rows[0].id,
  });
}

export async function getSubscriptionFromUser(userId) {
  const subscription = await connection.query(
    `
    SELECT
      *
    FROM
      subscriptions
    WHERE
      user_id = $1;
  `,
    [userId]
  );
  return subscription.rows;
}
