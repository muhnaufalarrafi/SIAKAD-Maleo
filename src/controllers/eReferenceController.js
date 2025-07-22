// src/controllers/eReferenceController.js
import { EReferenceModel } from '../models/eReferenceModel.js';
import { TutorModel } from '../models/tutorModel.js';

// Cek apakah user punya role tertentu
function isRole(user, roleName) {
  return (user.roles || []).some(r => r.name.toLowerCase() === roleName);
}

// Ambil ID tutor dari user_id
async function resolveTutorProfileId(userId) {
  const tutorRes = await TutorModel.getByUserId(userId);
  if (!tutorRes.rows.length) throw new Error('User bukan tutor');
  return tutorRes.rows[0].id;
}

// GET /e-reference
export const getAllEReference = async (req, res) => {
  try {
    const { rows } = await EReferenceModel.getAll();
    res.json(rows);
  } catch (err) {
    console.error('[getAllEReference]', err);
    res.status(500).json({ error: 'Gagal mengambil data e-reference' });
  }
};

// GET /e-reference/:id
export const getEReferenceById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows } = await EReferenceModel.getById(id);
    if (!rows.length) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[getEReferenceById]', err);
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
};

// POST /e-reference (link/video)
export const createEReference = async (req, res) => {
  try {
    let tutorProfileId = null;
    if (isRole(req.user, 'tutor')) {
      tutorProfileId = await resolveTutorProfileId(req.user.id);
    }

    const {
      judul,
      deskripsi,
      program_id,
      mata_pelajaran_id,
      tipe,
      url
    } = req.body;

    if (!judul || !program_id || !mata_pelajaran_id || !tipe || !url?.trim()) {
      return res.status(400).json({ error: 'Judul, program, mata pelajaran, tipe, dan URL wajib diisi' });
    }

    if (!['link', 'video'].includes(tipe)) {
      return res.status(400).json({ error: 'Tipe harus berupa "link" atau "video"' });
    }

    const payload = {
      judul,
      deskripsi: deskripsi || null,
      program_id: +program_id,
      mata_pelajaran_id: +mata_pelajaran_id,
      tipe,
      url: url.trim(),
      uploaded_by: tutorProfileId
    };

    const { rows } = await EReferenceModel.create(payload);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[createEReference]', err);
    const status = err.message === 'User bukan tutor' ? 403 : 500;
    res.status(status).json({ error: err.message });
  }
};

// POST /e-reference/upload (file)
export const uploadReferenceFile = async (req, res) => {
  try {
    let uploadedBy = null;

    try {
      uploadedBy = await resolveTutorProfileId(req.user.id);
    } catch (err) {
      console.warn('[uploadReferenceFile] User bukan tutor:', err.message);
    }

    const {
      judul,
      deskripsi,
      program_id,
      mata_pelajaran_id,
    } = req.body;

    const fileUrl = req.body.fileUrl || req.fileUrl;
    if (!judul || !program_id || !mata_pelajaran_id || !fileUrl) {
      return res.status(400).json({ error: 'Judul, program, mata pelajaran, dan file wajib diisi' });
    }

    const payload = {
      judul,
      deskripsi: deskripsi || null,
      program_id: +program_id,
      mata_pelajaran_id: +mata_pelajaran_id,
      tipe: 'file',
      url: fileUrl,
      uploaded_by: uploadedBy
    };

    console.log('[uploadReferenceFile] Payload:', payload);
    console.log('[uploadReferenceFile] User:', req.user);

    const { rows } = await EReferenceModel.create(payload);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[uploadReferenceFile]', err);
    res.status(500).json({ error: err.message || 'Gagal mengunggah file e-reference' });
  }
};

// PUT /e-reference/:id
export const updateEReference = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows } = await EReferenceModel.getById(id);
    if (!rows.length) return res.status(404).json({ error: 'Data tidak ditemukan' });
    const reference = rows[0];

    let tutorProfileId = reference.uploaded_by;
    if (isRole(req.user, 'tutor')) {
      tutorProfileId = await resolveTutorProfileId(req.user.id);
      if (reference.uploaded_by !== tutorProfileId) {
        return res.status(403).json({ error: 'Tidak berwenang memperbarui data ini' });
      }
    }

    const newUrl = req.body.fileUrl || req.body.url || reference.url;
    const newType = req.body.fileUrl ? 'file' : (req.body.tipe || reference.tipe);

    if (!newUrl) return res.status(400).json({ error: 'URL tidak boleh kosong' });

    const payload = {
      judul: req.body.judul ?? reference.judul,
      deskripsi: req.body.deskripsi ?? reference.deskripsi,
      program_id: +req.body.program_id || reference.program_id,
      mata_pelajaran_id: +req.body.mata_pelajaran_id || reference.mata_pelajaran_id,
      tipe: newType,
      url: newUrl,
      uploaded_by: tutorProfileId
    };

    const { rows: updated } = await EReferenceModel.update(id, payload);
    res.json(updated[0]);
  } catch (err) {
    console.error('[updateEReference]', err);
    res.status(500).json({ error: 'Gagal memperbarui reference' });
  }
};

// PUT /e-reference/:id/file
export const updateReferenceFile = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows } = await EReferenceModel.getById(id);
    if (!rows.length) return res.status(404).json({ error: 'Data tidak ditemukan' });
    const reference = rows[0];

    const newFileUrl = req.body.fileUrl || req.fileUrl;
    if (!newFileUrl) {
      return res.status(400).json({ error: 'File URL dari middleware tidak ditemukan' });
    }

    const payload = {
      judul: reference.judul,
      deskripsi: reference.deskripsi,
      program_id: reference.program_id,
      mata_pelajaran_id: reference.mata_pelajaran_id,
      tipe: 'file',
      url: newFileUrl,
      uploaded_by: reference.uploaded_by
    };

    const { rows: updated } = await EReferenceModel.update(id, payload);
    res.json(updated[0]);
  } catch (err) {
    console.error('[updateReferenceFile]', err);
    res.status(500).json({ error: 'Gagal mengganti file' });
  }
};

// DELETE /e-reference/:id
export const deleteEReference = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { rows } = await EReferenceModel.getById(id);
    if (!rows.length) return res.status(404).json({ error: 'Data tidak ditemukan' });

    const reference = rows[0];
    if (isRole(req.user, 'tutor')) {
      const tutorProfileId = await resolveTutorProfileId(req.user.id);
      if (reference.uploaded_by !== tutorProfileId) {
        return res.status(403).json({ error: 'Tidak berwenang menghapus data ini' });
      }
    }

    await EReferenceModel.delete(id);
    res.json({ message: 'E-reference berhasil dihapus' });
  } catch (err) {
    console.error('[deleteEReference]', err);
    res.status(500).json({ error: 'Gagal menghapus data' });
  }
};
