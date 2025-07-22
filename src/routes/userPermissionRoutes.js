import express from 'express';
import {
  getAllUserPermissions,
  getUserPermissionsByUserId,
  getUsersByPermissionId,
  assignUserPermission,
  removeUserPermission
} from '../controllers/userPermissionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllUserPermissions);
router.get('/user/:user_id', getUserPermissionsByUserId);
router.get('/permission/:permission_id', getUsersByPermissionId);
router.post('/', authorize('user_permissions.override'), assignUserPermission);
router.delete('/', authorize('user_permissions.delete'), removeUserPermission);

export default router;
