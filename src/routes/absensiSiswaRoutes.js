// src\routes\absensiSiswaRoutes.js
import express from 'express';
import {
  getAbsensiSiswaByJadwalTanggal,
  inputAbsensiSiswa
} from '../controllers/absensiSiswaController.js';

const router = express.Router();

router.get('/', getAbsensiSiswaByJadwalTanggal); // ?jadwal_id=...&tanggal=...
router.post('/', inputAbsensiSiswa); // bulk insert/update

export default router;
