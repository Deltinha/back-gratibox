import connection from '../../src/database/database';
import faker from 'faker';
import createAddress from './addressFactory';

export async function createSubscription(userId, deliveryDayId) {
  const addressId = createAddress();

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
