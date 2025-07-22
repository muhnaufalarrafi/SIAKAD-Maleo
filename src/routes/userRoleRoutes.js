import express from 'express';
import {
  getAllUserRoles,
  getUserRolesByUserId,
  getUserRolesByRoleId,
  assignUserRole,
  removeUserRole
} from '../controllers/userRoleController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllUserRoles);
router.get('/user/:user_id', getUserRolesByUserId);
router.get('/role/:role_id', getUserRolesByRoleId);
router.post('/', authorize('user_roles.assign'), assignUserRole);
router.delete('/', authorize('user_roles.delete'), removeUserRole);

export default router;
