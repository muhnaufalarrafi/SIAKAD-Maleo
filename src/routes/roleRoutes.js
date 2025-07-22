import express from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', authorize('roles.read'), getAllRoles);
router.get('/:id', getRoleById);
router.post('/', authorize('roles.create'), createRole);
router.put('/:id', authorize('roles.update'), updateRole);
router.delete('/:id', authorize('roles.delete'), deleteRole);

export default router;
