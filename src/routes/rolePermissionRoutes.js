// src\routes\rolePermissionRoutes.js
import express from 'express';
import {
  getAllRolePermissions,
  getPermissionsByRoleId,
  getRolesByPermissionId,
  assignRolePermission,
  removeRolePermission
} from '../controllers/rolePermissionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllRolePermissions);
router.get('/role/:role_id', getPermissionsByRoleId);
router.get('/permission/:permission_id', getRolesByPermissionId);
router.post('/', authorize('role_permissions.assign'), assignRolePermission);
router.delete('/', authorize('role_permissions.delete'), removeRolePermission); 

export default router;
