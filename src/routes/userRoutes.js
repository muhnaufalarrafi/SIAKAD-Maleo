// src\routes\userRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';


const router = express.Router();

router.get('/', authenticate, authorize('users.read'), getAllUsers);
router.get('/:id', getUserById);
router.post('/', authenticate, authorize('users.create'), createUser);
router.put('/:id', authenticate, authorize('users.update'), updateUser);
router.delete('/:id', authenticate, authorize('users.delete'),deleteUser);

export default router;
