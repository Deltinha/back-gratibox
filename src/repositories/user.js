import connection from '../database/database';

// eslint-disable-next-line import/prefer-default-export
export async function getSession(token) {
  const session = await connection.query(
    `
    SELECT 
      * 
    FROM
      sessions
    WHERE
     token = $1;
  `,
    [token]
  );
  return session.rows;
}

export async function insertUser(userInfo) {
  const { name, email, hashedPass } = userInfo;
  connection.query(
    `
      INSERT INTO users
        (name, email, password )
      VALUES
        ($1, $2, $3 );
    `,
    [name, email, hashedPass]
  );
}

export async function getUserByEmail(email) {
  const user = await connection.query(
    `
        SELECT
          *
        FROM
          users
        WHERE
          email=$1;
    `,
    [email]
  );
  return user.rows;
}

export async function createSession(session) {
  const { userId, token } = session;
  await connection.query(
    `
    INSERT INTO sessions
      (user_id, token)
    VALUES ($1, $2);
  `,
    [userId, token]
  );
}

export async function getPlanFromUser(userId) {
  const plan = await connection.query(
    `
    SELECT
      subscriptions.id,
      subscriptions.user_id,
      subscription_date,
      delivery_days.day,
      plans.name AS "plan",
      array_agg(products.name) AS "products"
    FROM
      subscriptions
    JOIN delivery_days
      ON delivery_day_id=delivery_days.id
    JOIN plans
      ON plans.id=plan_id
    JOIN products_subscriptions
      ON subscriptions.id=products_subscriptions.subscription_id
    JOIN products
      ON products.id=product_id
    WHERE
      user_id = $1
    GROUP BY 1,4,5;
    `,
    [userId]
  );
  return plan.rows[0];
}
