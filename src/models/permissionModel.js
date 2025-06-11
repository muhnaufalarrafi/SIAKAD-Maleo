// src\models\permissionModel.js
import { query } from '../config/db.js';

export const PermissionModel = {
  getAll: () => query('SELECT * FROM permissions'),
  getById: (id) => query('SELECT * FROM permissions WHERE id = $1', [id]),
  create: ({ name, description }) =>
    query(
      `INSERT INTO permissions (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    ),
  update: (id, { name, description }) =>
    query(
      `UPDATE permissions SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    ),
  delete: (id) => query('DELETE FROM permissions WHERE id = $1 RETURNING *', [id]),
};
