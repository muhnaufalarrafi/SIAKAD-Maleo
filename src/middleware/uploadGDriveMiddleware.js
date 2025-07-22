// src/middlewares/uploadGDriveMiddleware.js

import fetch from 'node-fetch';
import { EReferenceModel } from '../models/eReferenceModel.js';

const APPSCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzlINcTjOxcSINRBt0CvQQ-6ZM13pSV-pTY73OKLWF6WBMuB_7FzYl6J8nSvmbtj0sYqQ/exec';

/**
 * POST → upload baru (create)
 * Expects: req.file
 * Attaches: req.body.fileId, req.body.fileUrl
 */
export const uploadToDriveWithAppScript = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File tidak ditemukan di request' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const base64Data = buffer.toString('base64');

    const response = await fetch(APPSCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:     'create',
        fileName:   originalname,
        mimeType:   mimetype,
        base64Data
      })
    });

    const result = await response.json();
    if (result.error) {
      console.error('[uploadToDriveWithAppScript] Apps Script error:', result.error);
      return res.status(500).json({ error: 'Gagal upload ke Google Drive' });
    }

    // ✅ simpan ke req, bukan req.body
    req.fileId  = result.fileId;
    req.fileUrl = result.url;

    next();
  } catch (err) {
    console.error('[uploadToDriveWithAppScript] Error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat upload file' });
  }
};

/**
 * POST → replace file lama dengan yang baru (update)
 * Expects: req.file, req.body.oldFileId
 * Attaches: req.body.fileId, req.body.fileUrl
 */
export const replaceDriveFileWithAppScript = async (req, res, next) => {
  try {
    if (!req.file || !req.body.oldFileId) {
      return res.status(400).json({ error: 'OldFileId atau file tidak lengkap' });
    }
    const { buffer, originalname, mimetype } = req.file;
    const { oldFileId } = req.body;
    const base64Data = buffer.toString('base64');

    const response = await fetch(APPSCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:     'update',
        oldFileId,
        fileName:   originalname,
        mimeType:   mimetype,
        base64Data
      })
    });
    const result = await response.json();
    if (result.error) {
      console.error('[replaceDriveFileWithAppScript] Apps Script error:', result.error);
      return res.status(500).json({ error: 'Gagal replace file di Google Drive' });
    }

    req.body.fileId  = result.fileId;
    req.body.fileUrl = result.url;
    next();

  } catch (err) {
    console.error('[replaceDriveFileWithAppScript] Error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat replace file' });
  }
};

/**
 * POST → hapus file di Drive (delete)
 * Expects: req.params.id (reference ID)
 */
export const deleteDriveFileWithAppScript = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rows } = await EReferenceModel.getById(id);
    if (!rows.length) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    const url = rows[0].url;
    const match = url.match(/[-\w]{25,}/);
    if (match) {
      const fileId = match[0];
      const response = await fetch(APPSCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', fileId })
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
    }

    next();
  } catch (err) {
    console.error('[deleteDriveFileWithAppScript]', err);
    res.status(500).json({ error: 'Gagal menghapus file di Drive' });
  }
};
