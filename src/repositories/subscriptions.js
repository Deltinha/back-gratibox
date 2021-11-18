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
      SELECT * FROM plan_days where plan_id = $1;
    `,
    [planId]
  );
  return days.rows;
}

export async function getProducts() {
  const products = await connection.query(`
      SELECT * FROM products;
    `);
  return products.rows;
}
