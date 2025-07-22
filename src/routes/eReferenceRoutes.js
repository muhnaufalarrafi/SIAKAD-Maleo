import express from 'express';
import multer from 'multer';
import {
  getAllEReference,
  getEReferenceById,
  createEReference,
  updateEReference,
  deleteEReference,
  uploadReferenceFile,
  updateReferenceFile
} from '../controllers/eReferenceController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

import {
  uploadToDriveWithAppScript,
  replaceDriveFileWithAppScript,
  deleteDriveFileWithAppScript
} from '../middleware/uploadGDriveMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Semua endpoint e-reference wajib login
router.use(authenticate);

// ===================================
// GET All & By ID
// ===================================
router.get('/', getAllEReference);
router.get('/:id', getEReferenceById);

// ===================================
// POST link/video (tanpa file)
// ===================================
router.post('/', createEReference);

// ===================================
// POST upload file (pakai Google Drive middleware)
// ===================================
router.post(
  '/upload',
  upload.single('file'),
  authorize('e-reference.create'),
  uploadToDriveWithAppScript,
  uploadReferenceFile
);

// ===================================
// PUT metadata update (judul, deskripsi, program, mapel, url)
// ===================================
router.put('/:id', 
  authorize('e-reference.update'),
  updateEReference);

// ===================================
// PUT ganti file (via FormData)
// ===================================
router.put(
  '/:id/file',
  upload.single('file'),
  authorize('e-reference.update'),
  replaceDriveFileWithAppScript,
  updateReferenceFile
);

// ===================================
// DELETE record (sekalian hapus file di Google Drive jika ada)
// ===================================
router.delete(
  '/:id',
  authorize('e-reference.delete'),
  deleteDriveFileWithAppScript,
  deleteEReference
);

export default router;
