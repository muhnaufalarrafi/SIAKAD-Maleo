import { UserRoleModel } from '../models/userRoleModel.js';
import { RolePermissionModel } from '../models/rolePermissionModel.js';
import { UserPermissionModel } from '../models/userPermissionModel.js';

export const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      // 1. Ambil semua role user
      const userRolesRes = await UserRoleModel.getByUserId(userId);
      const roleIds = userRolesRes.rows.map(r => r.role_id);

      // 2. Ambil semua permission dari role
      let rolePermissionsRes = { rows: [] };
      if (roleIds.length > 0) {
        rolePermissionsRes = await RolePermissionModel.getByMultipleRoleIds(roleIds);
      }
      const rolePermissions = rolePermissionsRes.rows.map(p => p.permission_name);

      // 3. Cek override user langsung
      const userPermRes = await UserPermissionModel.getByUserId(userId);
      const overrides = {};
      for (const row of userPermRes.rows) {
        overrides[row.permission_name] = row.override_type;
      }

      // 4. Final decision
      if (overrides[requiredPermission] === 'deny') {
        return res.status(403).json({ error: 'Permission denied by override' });
      }

      if (overrides[requiredPermission] === 'allow' || rolePermissions.includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({ error: 'Permission denied' });

    } catch (err) {
      return res.status(500).json({ error: 'Authorization failed' });
    }
  };
};
