// src\routes\jadwalRoutes.js
import express from 'express';
import {
  getAllJadwal,
  getJadwalById,
  createJadwal,
  updateJadwal,
  deleteJadwal
} from '../controllers/jadwalController.js';

const router = express.Router();

router.get('/', getAllJadwal);
router.get('/:id', getJadwalById);
router.post('/', createJadwal);
router.put('/:id', updateJadwal);
router.delete('/:id', deleteJadwal);

export default router;
