// src\routes\absensiGuruRoutes.js
import express from 'express';
import {
  getAllAbsensiGuru,
  getAbsensiGuruById,
  checkinGuru,
  checkoutGuru,
  getTodayByUser,
} from '../controllers/absensiGuruController.js';
import { checkDistanceWithAppScript } from '../middleware/checkDistanceMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getAllAbsensiGuru);
router.get('/:id', getAbsensiGuruById);
router.post('/checkin', checkDistanceWithAppScript, checkinGuru); // ⬅️ Middleware ditambahkan di sini
router.put('/checkout/:id', checkoutGuru);
router.get('/today/:userId', getTodayByUser);


export default router;
