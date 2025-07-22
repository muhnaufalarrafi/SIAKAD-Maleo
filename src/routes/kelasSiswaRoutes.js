// src/routes/kelasSiswaRoutes.js
import express from 'express';
import {
  getAllKelasSiswa,
  getKelasSiswaById,
  assignSiswaToKelas,      // <-- renamed here
  updateKelasSiswa,
  deleteKelasSiswa
} from '../controllers/kelasSiswaController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/',              getAllKelasSiswa);
router.get('/:id',           getKelasSiswaById);
router.post('/', authorize('class-siswa.assign'), assignSiswaToKelas);   // <-- use new name
router.put('/:id', authorize('class-siswa.update'), updateKelasSiswa);
router.delete('/:id', authorize('class-siswa.delete'), deleteKelasSiswa);

export default router;
