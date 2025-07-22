// src/models/userModel.js
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

  // --- FUNGSI UPDATE YANG SEPENUHNYA DINAMIS ---
  update: (id, dataToUpdate) => {
    const fields = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);

    // Membuat bagian "SET" dari query secara dinamis
    // Hasilnya akan seperti: "email" = $1, "password" = $2
    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');

    // Menambahkan 'id' untuk klausa WHERE di akhir array values
    values.push(id);
    const whereClausePosition = values.length;

    const queryText = `
      UPDATE users 
      SET ${setClause} 
      WHERE id = $${whereClausePosition} 
      RETURNING id, username, email, status_aktif
    `;

    return query(queryText, values);
  },

  delete: (id) => query('DELETE FROM users WHERE id = $1 RETURNING *', [id]),

  updateTokenVersion: (userId, newVersion) => 
    query(
        'UPDATE users SET token_version = $1 WHERE id = $2 RETURNING *',
        [newVersion, userId]
    ),

};
