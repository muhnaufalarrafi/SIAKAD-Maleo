// src/routes/siswaRoutes.js
import express from 'express';
import {
  getAllSiswa,
  getSiswaById,
  getSiswaByUserId,
  createSiswa,
  updateSiswa,
  deleteSiswa
} from '../controllers/siswaController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/',           getAllSiswa);
router.get('/:id',        getSiswaById);
router.get('/user/:user_id', getSiswaByUserId);
router.post('/', authorize('siswa.create'), createSiswa);
router.put('/:id', authorize('siswa.update'), updateSiswa);
router.delete('/:id', authorize('siswa.delete'), deleteSiswa);

export default router;
