// src\routes\tutorRoutes.js
import express from 'express';
import {
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor
} from '../controllers/tutorController.js';

const router = express.Router();

router.get('/', getAllTutors);
router.get('/:id', getTutorById);
router.post('/', createTutor);
router.put('/:id', updateTutor);
router.delete('/:id', deleteTutor);

export default router;
