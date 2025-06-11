// src\routes\eReferenceRoutes.js
import express from 'express';
import {
  getAllEReference,
  getEReferenceById,
  createEReference,
  updateEReference,
  deleteEReference
} from '../controllers/eReferenceController.js';

const router = express.Router();

router.get('/', getAllEReference);
router.get('/:id', getEReferenceById);
router.post('/', createEReference);
router.put('/:id', updateEReference);
router.delete('/:id', deleteEReference);

export default router;
