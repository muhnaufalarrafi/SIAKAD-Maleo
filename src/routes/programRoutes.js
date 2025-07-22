// src\routes\programRoutes.js
import express from 'express';
import {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../controllers/programController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllPrograms);
router.get('/:id', getProgramById);
router.post('/', authorize('program.create'), createProgram);
router.put('/:id', authorize('program.update'), updateProgram);
router.delete('/:id', authorize('program.delete'), deleteProgram);

export default router;
