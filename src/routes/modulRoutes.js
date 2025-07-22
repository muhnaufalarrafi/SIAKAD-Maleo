// src\routes\modulRoutes.js
import express from 'express';
import {
  getAllModul,
  getModulById,
  createModul,
  updateModul,
  deleteModul
} from '../controllers/modulController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllModul);
router.get('/:id', getModulById);
router.post('/', authorize('modul.create'), createModul);
router.put('/:id', authorize('modul.update'), updateModul);
router.delete('/:id', authorize('modul.delete'), deleteModul);

export default router;
