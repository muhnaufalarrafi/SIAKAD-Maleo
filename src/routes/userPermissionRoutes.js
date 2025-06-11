import express from 'express';
import {
  getAllUserPermissions,
  getUserPermissionsByUserId,
  getUsersByPermissionId,
  assignUserPermission,
  removeUserPermission
} from '../controllers/userPermissionController.js';

const router = express.Router();

router.get('/', getAllUserPermissions);
router.get('/user/:user_id', getUserPermissionsByUserId);
router.get('/permission/:permission_id', getUsersByPermissionId);
router.post('/', assignUserPermission);
router.delete('/', removeUserPermission);

export default router;
