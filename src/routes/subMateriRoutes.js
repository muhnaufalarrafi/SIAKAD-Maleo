// src/routes/subMateriRoutes.js
import express from 'express';
import {
  getAllSubMateri,
  getSubMateriById,
  createSubMateri,
  updateSubMateri,
  deleteSubMateri
} from '../controllers/subMateriController.js';

const router = express.Router();

router.get('/', getAllSubMateri);
router.get('/:id', getSubMateriById);
router.post('/', createSubMateri);
router.put('/:id', updateSubMateri);
router.delete('/:id', deleteSubMateri);

export default router;
