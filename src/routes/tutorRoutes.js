// src/routes/tutorRoutes.js
import express from 'express';
import {
  getAllTutors,
  getTutorById,
  getTutorByUserId,
  createTutor,
  updateTutor,
  deleteTutor
} from '../controllers/tutorController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
router.use(authenticate);

router.get('/',           getAllTutors);
router.get('/:id',        getTutorById);
router.get('/user/:user_id', getTutorByUserId);
router.post('/', authorize('tutor.create'), createTutor);
router.put('/:id', authorize('tutor.update'), updateTutor);
router.delete('/:id', authorize('tutor.delete'), deleteTutor);

export default router;
