// src\routes\mapelRoutes.js
import express from 'express';
import {
  getAllMapel,
  getMapelById,
  createMapel,
  updateMapel,
  deleteMapel
} from '../controllers/mapelController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllMapel);
router.get('/:id', getMapelById);
router.post('/', authorize('mata_pelajaran.create'), createMapel);
router.put('/:id', authorize('mata_pelajaran.update'), updateMapel);
router.delete('/:id', authorize('mata_pelajaran.delete'), deleteMapel);

export default router;
