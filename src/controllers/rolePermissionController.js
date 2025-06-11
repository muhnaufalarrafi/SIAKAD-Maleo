// src/controllers/rolePermissionController.js
import { RolePermissionModel } from '../models/rolePermissionModel.js';
import { RoleModel } from '../models/roleModel.js'; // Pastikan untuk import RoleModel

export const getAllRolePermissions = async (req, res) => {
  try {
    const result = await RolePermissionModel.getAll();

    // Kelompokkan berdasarkan role_id
    const rolePermissions = result.rows.reduce((acc, row) => {
      const { role_id, role_name, permission_name } = row;

      // Jika role belum ada, tambahkan
      if (!acc[role_id]) {
        acc[role_id] = { role_id, role_name, permissions: [] };
      }

      // Tambahkan permission ke role yang sesuai
      acc[role_id].permissions.push(permission_name);

      return acc;
    }, {});

    // Mengambil semua roles tanpa memperhatikan apakah ada permission atau tidak
    const allRolesResult = await RoleModel.getAll();
    const allRoles = allRolesResult.rows;

    // Gabungkan roles yang tidak memiliki permission dengan roles yang memiliki permission
    allRoles.forEach(role => {
      if (!rolePermissions[role.id]) {
        rolePermissions[role.id] = { 
          role_id: role.id, 
          role_name: role.name, 
          permissions: [] 
        };
      }
    });

    // Convert hasil menjadi array dan kirimkan
    const formattedResponse = Object.values(rolePermissions);
    res.json(formattedResponse);
  } catch (err) {
    console.error('Error fetching role-permissions:', err);
    res.status(500).json({ error: 'Failed to fetch role-permissions' });
  }
};

export const getPermissionsByRoleId = async (req, res) => {
  try {
    const result = await RolePermissionModel.getByRoleId(req.params.role_id);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch permissions for role' });
  }
};

export const getRolesByPermissionId = async (req, res) => {
  try {
    const result = await RolePermissionModel.getByPermissionId(req.params.permission_id);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch roles for permission' });
  }
};

export const assignRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    const result = await RolePermissionModel.assign({ role_id, permission_id });
    res.status(201).json(result.rows[0] || { message: 'Already assigned' });
  } catch {
    res.status(500).json({ error: 'Failed to assign permission to role' });
  }
};

export const removeRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    const result = await RolePermissionModel.remove({ role_id, permission_id });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Permission removed from role' });
  } catch {
    res.status(500).json({ error: 'Failed to remove permission from role' });
  }
};

  // Ambil permissions berdasarkan multiple role_ids
  getByMultipleRoleIds: (roleIds) => {
    const placeholders = roleIds.map((_, i) => `$${i + 1}`).join(',');
    return query(`
      SELECT rp.role_id, rp.permission_id, p.name AS permission_name
      FROM role_permissions rp
      JOIN permissions p ON p.id = rp.permission_id
      WHERE rp.role_id IN (${placeholders})
    `, roleIds);
  };
