//src\models\userRoleModel.js
import { query } from '../config/db.js';

export const UserRoleModel = {
  getAll: () => query(`
    SELECT ur.user_id, u.username, ur.role_id, r.name AS role_name
    FROM user_roles ur
    JOIN users u ON u.id = ur.user_id
    JOIN roles r ON r.id = ur.role_id
  `),

  getByUserId: (userId) => query(`
    SELECT ur.user_id, ur.role_id, r.name AS role_name
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
  `, [userId]),

  getByRoleId: (roleId) => query(`
    SELECT ur.user_id, u.username, ur.role_id
    FROM user_roles ur
    JOIN users u ON u.id = ur.user_id
    WHERE ur.role_id = $1
  `, [roleId]),

  assign: ({ user_id, role_id }) => query(`
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `, [user_id, role_id]),

  remove: ({ user_id, role_id }) => query(`
    DELETE FROM user_roles
    WHERE user_id = $1 AND role_id = $2
    RETURNING *
  `, [user_id, role_id]),
};
