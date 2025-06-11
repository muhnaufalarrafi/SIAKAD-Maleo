// src\routes\kelasSiswaRoutes.js
import express from 'express';
import {
  getSiswaByJadwal,
  assignSiswaToJadwal,
  removeSiswaFromJadwal
} from '../controllers/kelasSiswaController.js';

const router = express.Router();

router.get('/:jadwalId', getSiswaByJadwal);
router.post('/', assignSiswaToJadwal);
router.delete('/', removeSiswaFromJadwal);

export default router;
