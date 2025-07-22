// src/routes/materiRoutes.js
import express from 'express';
import {
  getAllMateri,
  getMateriById,
  createMateri,
  updateMateri,
  deleteMateri
} from '../controllers/materiController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllMateri);
router.get('/:id', getMateriById);
router.post('/', authorize('materi.create'), createMateri);
router.put('/:id', authorize('materi.update'), updateMateri);
router.delete('/:id', authorize('materi.delete'), deleteMateri);

export default router;
