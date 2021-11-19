import connection from '../../src/database/database';

export default async function planFactory() {
  const plan = await connection.query(`
      INSERT INTO plans (name) VALUES ('mensal')
      RETURNING *;
    `);
  const deliveryDay = await connection.query(`
      INSERT INTO delivery_days (day, plan_id)
      VALUES (10, ${plan.rows[0].id})
      RETURNING *;
    `);

  return deliveryDay.rows[0].id;
}
