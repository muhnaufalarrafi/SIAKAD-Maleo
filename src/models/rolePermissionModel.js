// src\models\rolePermissionModel.js
import { query } from '../config/db.js';

export const RolePermissionModel = {
  getAll: () => query(`
    SELECT rp.role_id, r.name AS role_name, rp.permission_id, p.name AS permission_name
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
  `),

  getByRoleId: (roleId) => query(`
    SELECT rp.role_id, rp.permission_id, p.name AS permission_name
    FROM role_permissions rp
    JOIN permissions p ON p.id = rp.permission_id
    WHERE rp.role_id = $1
  `, [roleId]),

  getByPermissionId: (permissionId) => query(`
    SELECT rp.permission_id, rp.role_id, r.name AS role_name
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    WHERE rp.permission_id = $1
  `, [permissionId]),

  assign: ({ role_id, permission_id }) => query(`
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `, [role_id, permission_id]),

  remove: ({ role_id, permission_id }) => query(`
    DELETE FROM role_permissions
    WHERE role_id = $1 AND permission_id = $2
    RETURNING *
  `, [role_id, permission_id]),

  getByMultipleRoleIds: (roleIds) => {
    if (!roleIds || roleIds.length === 0) {
      // Jika roleIds kosong, return an empty result set atau bisa return null
      return Promise.resolve({ rows: [] });
    }

    const placeholders = roleIds.map((_, i) => `$${i + 1}`).join(',');
    return query(`
      SELECT rp.role_id, rp.permission_id, p.name AS permission_name
      FROM role_permissions rp
      JOIN permissions p ON p.id = rp.permission_id
      WHERE rp.role_id IN (${placeholders})
    `, roleIds);
  },
};
