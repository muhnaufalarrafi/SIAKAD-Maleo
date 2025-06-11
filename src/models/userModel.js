// src\models\userModel.js
import { query } from '../config/db.js';

export const UserModel = {
  getAll: () => query('SELECT * FROM users'),
  getById: (id) => query('SELECT * FROM users WHERE id = $1', [id]),
  getByEmail: (email) => query('SELECT * FROM users WHERE email = $1', [email]),

  getByIdentifier: (identifier) => query(`
  SELECT * FROM users
  WHERE email = $1 OR username = $1 OR id = $1
  LIMIT 1
`, [identifier]),

  create: ({ id, username, email, password, status_aktif }) =>
    query(
      `INSERT INTO users (id, username, email, password, status_aktif) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, username, email, password, status_aktif]
    ),

  update: (id, data) => {
    const fields = ['username', 'email', 'status_aktif'];
    const values = [data.username, data.email, data.status_aktif];
    let setClause = `username = $1, email = $2, status_aktif = $3`;

    if (data.password) {
      fields.push('password');
      values.push(data.password);
      setClause += `, password = $4`;
    }

    const queryText = `UPDATE users SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`;
    values.push(id);

    return query(queryText, values);
  },

    delete: (id) => query('DELETE FROM users WHERE id = $1 RETURNING *', [id]),
};
