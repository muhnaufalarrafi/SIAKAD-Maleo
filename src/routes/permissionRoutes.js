import express from 'express';
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from '../controllers/permissionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', authorize('permissions.read'), getAllPermissions);
router.get('/:id', getPermissionById);
router.post('/', authorize('permissions.create'), createPermission);
router.put('/:id', authorize('permissions.update'), updatePermission);
router.delete('/:id', authorize('permissions.delete'), deletePermission);

export default router;
