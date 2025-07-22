// src/routes/authRoutes.js
import express from 'express';
import { register, login, logout, getMe, updateMyAccount } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMyAccount);

export default router;
