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
  return user.rowCount;
}

export async function createSession(session) {
  const { user_id: userId, token } = session;
  await connection.query(
    `
    INSERT INTO sessions
      (user_id, token)
    VALUES ($1, $2);
  `,
    [userId, token]
  );
}
