// src/routes/subMateriRoutes.js
import express from 'express';
import {
  getAllSubMateri,
  getSubMateriById,
  createSubMateri,
  updateSubMateri,
  deleteSubMateri
} from '../controllers/subMateriController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllSubMateri);
router.get('/:id', getSubMateriById);
router.post('/', authorize('sub-materi.create'), createSubMateri);
router.put('/:id', authorize('sub-materi.update'), updateSubMateri);
router.delete('/:id', authorize('sub-materi.delete'), deleteSubMateri);

export default router;
