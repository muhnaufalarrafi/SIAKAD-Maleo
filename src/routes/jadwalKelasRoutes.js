// src/routes/jadwalKelasRoutes.js
import express from 'express';
import {
  getAllJadwal,
  getJadwalById,
  getJadwalByTutorId,
  createJadwal,
  updateJadwal,
  deleteJadwal
} from '../controllers/jadwalKelasController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Semua endpoint jadwal harus login
router.use(authenticate);

router.get('/', getAllJadwal);
router.get('/by-tutor/:tutor_id', getJadwalByTutorId);
router.get('/:id', getJadwalById);
router.post('/', authorize('jadwal.create'), createJadwal);
router.put('/:id', authorize('jadwal.update'), updateJadwal);
router.delete('/:id', authorize('jadwal.delete'), deleteJadwal);

export default router;
