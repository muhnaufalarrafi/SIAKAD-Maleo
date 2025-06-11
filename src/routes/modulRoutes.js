// src\routes\modulRoutes.js
import express from 'express';
import {
  getAllModul,
  getModulById,
  createModul,
  updateModul,
  deleteModul
} from '../controllers/modulController.js';

const router = express.Router();

router.get('/', getAllModul);
router.get('/:id', getModulById);
router.post('/', createModul);
router.put('/:id', updateModul);
router.delete('/:id', deleteModul);

export default router;
