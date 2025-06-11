import express from 'express';
import {
  getAllUserRoles,
  getUserRolesByUserId,
  getUserRolesByRoleId,
  assignUserRole,
  removeUserRole
} from '../controllers/userRoleController.js';

const router = express.Router();

router.get('/', getAllUserRoles);
router.get('/user/:user_id', getUserRolesByUserId);
router.get('/role/:role_id', getUserRolesByRoleId);
router.post('/', assignUserRole);
router.delete('/', removeUserRole);

export default router;
