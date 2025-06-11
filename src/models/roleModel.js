//src\models\roleModel.js
import { query } from '../config/db.js';

export const RoleModel = {
  getAll: () => query('SELECT * FROM roles'),
  getById: (id) => query('SELECT * FROM roles WHERE id = $1', [id]),
  create: ({ name, description }) =>
    query(
      `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    ),
  update: (id, { name, description }) =>
    query(
      `UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    ),
  delete: (id) =>
    query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]),
};
