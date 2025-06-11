// src\routes\absensiGuruRoutes.js
import express from 'express';
import {
  getAllAbsensiGuru,
  getAbsensiGuruById,
  checkinGuru,
  checkoutGuru
} from '../controllers/absensiGuruController.js';
import { checkDistanceWithAppScript } from '../middleware/checkDistanceMiddleware.js';

const router = express.Router();

router.get('/', getAllAbsensiGuru);
router.get('/:id', getAbsensiGuruById);
router.post('/checkin', checkDistanceWithAppScript, checkinGuru); // ⬅️ Middleware ditambahkan di sini
router.put('/checkout/:id', checkoutGuru);

export default router;
