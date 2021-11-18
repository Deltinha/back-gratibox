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
