// src\routes\rolePermissionRoutes.js
import express from 'express';
import {
  getAllRolePermissions,
  getPermissionsByRoleId,
  getRolesByPermissionId,
  assignRolePermission,
  removeRolePermission
} from '../controllers/rolePermissionController.js';

const router = express.Router();

router.get('/', getAllRolePermissions);
router.get('/role/:role_id', getPermissionsByRoleId);
router.get('/permission/:permission_id', getRolesByPermissionId);
router.post('/', assignRolePermission);
router.delete('/', removeRolePermission); 

export default router;
