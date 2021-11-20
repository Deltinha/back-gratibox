import connection from '../../src/database/database';

export default async function createProduct() {
  const product = await connection.query(`
    INSERT INTO products
      (name)
    VALUES
      ('Chás')
    RETURNING *;
    `);

  return product.rows[0].id;
}
