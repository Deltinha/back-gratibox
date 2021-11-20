import connection from '../../src/database/database';
import createAddress from './addressFactory';
import createPlan from './planFactory';
import createProduct from './productsFactory';

export async function createSubscription(userId) {
  const addressId = await createAddress();
  const deliveryDayId = await createPlan();
  const productId = await createProduct();

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
    [userId, addressId, deliveryDayId]
  );

  await connection.query(
    `
    INSERT INTO products_subscriptions
      (product_id, subscription_id)
    VALUES
      ($1, $2)
  ;`,
    [productId, subscription.rows[0].id]
  );
}
