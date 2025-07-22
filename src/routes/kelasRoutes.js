// src/routes/kelasRoutes.js
import express from 'express';
import {
  getAllKelas,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas
} from '../controllers/kelasController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllKelas);
router.get('/:id', getKelasById);
router.post('/', authorize('class.create'), createKelas);
router.put('/:id', authorize('class.update'), updateKelas);
router.delete('/:id', authorize('class.delete'), deleteKelas);

export default router;
