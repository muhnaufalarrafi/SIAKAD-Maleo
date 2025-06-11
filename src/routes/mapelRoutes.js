// src\routes\mapelRoutes.js
import express from 'express';
import {
  getAllMapel,
  getMapelById,
  createMapel,
  updateMapel,
  deleteMapel
} from '../controllers/mapelController.js';

const router = express.Router();

router.get('/', getAllMapel);
router.get('/:id', getMapelById);
router.post('/', createMapel);
router.put('/:id', updateMapel);
router.delete('/:id', deleteMapel);

export default router;
