// src/routes/materiRoutes.js
import express from 'express';
import {
  getAllMateri,
  getMateriById,
  createMateri,
  updateMateri,
  deleteMateri
} from '../controllers/materiController.js';

const router = express.Router();

router.get('/', getAllMateri);
router.get('/:id', getMateriById);
router.post('/', createMateri);
router.put('/:id', updateMateri);
router.delete('/:id', deleteMateri);

export default router;
