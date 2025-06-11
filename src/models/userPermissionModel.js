//src\models\userPermissionModel.js
import { query } from '../config/db.js';

export const UserPermissionModel = {
  getAll: () => query(`
    SELECT up.user_id, u.username, up.permission_id, p.name AS permission_name, up.override_type
    FROM user_permissions up
    JOIN users u ON u.id = up.user_id
    JOIN permissions p ON p.id = up.permission_id
  `),

  getByUserId: (userId) => query(`
    SELECT up.permission_id, p.name AS permission_name, up.override_type
    FROM user_permissions up
    JOIN permissions p ON p.id = up.permission_id
    WHERE up.user_id = $1
  `, [userId]),

  getByPermissionId: (permissionId) => query(`
    SELECT up.user_id, u.username, up.override_type
    FROM user_permissions up
    JOIN users u ON u.id = up.user_id
    WHERE up.permission_id = $1
  `, [permissionId]),

  assign: ({ user_id, permission_id, override_type }) => query(`
    INSERT INTO user_permissions (user_id, permission_id, override_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, permission_id)
    DO UPDATE SET override_type = EXCLUDED.override_type
    RETURNING *
  `, [user_id, permission_id, override_type]),

  remove: ({ user_id, permission_id }) => query(`
    DELETE FROM user_permissions
    WHERE user_id = $1 AND permission_id = $2
    RETURNING *
  `, [user_id, permission_id]),

};
