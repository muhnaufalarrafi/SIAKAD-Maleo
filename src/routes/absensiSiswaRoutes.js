// src\routes\absensiSiswaRoutes.js
import express from 'express';
import {
  getAllAbsensiSiswa,
  getAbsensiSiswaById,
  getAbsensiSiswaByJadwalTanggal,
  createAbsensiSiswa,
  updateAbsensiSiswa,
  bulkUpsertAbsensiSiswa,
  deleteAbsensiSiswa,
  getTeachingHistoryByTutor
} from '../controllers/absensiSiswaController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate); 

// GET /absensi-siswa
// - tanpa query: ambil semua
// - dengan ?jadwal_id=&tanggal=: filter by jadwal+tanggal
router.get('/', (req, res, next) => {
  const { jadwal_id, tanggal } = req.query;
  if (jadwal_id && tanggal) {
    return getAbsensiSiswaByJadwalTanggal(req, res, next);
  }
  return getAllAbsensiSiswa(req, res, next);
});

router.get('/history/tutor/:tutor_id', getTeachingHistoryByTutor);

// GET /absensi-siswa/:id  → ambil 1 record by id
router.get('/:id', getAbsensiSiswaById);

// POST /absensi-siswa       → create satu record
router.post('/', createAbsensiSiswa);

// PUT /absensi-siswa/:id    → update satu record
router.put('/:id', updateAbsensiSiswa);

// DELETE /absensi-siswa/:id → hapus satu record
router.delete('/:id', deleteAbsensiSiswa);

// POST /absensi-siswa/bulk  → bulk upsert (insert/update massal)
router.post('/bulk', bulkUpsertAbsensiSiswa);

export default router;
