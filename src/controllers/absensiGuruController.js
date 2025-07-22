// src\controllers\absensiGuruController.js
import { AbsensiGuruModel } from '../models/absensiGuruModel.js';
import { TutorModel } from '../models/tutorModel.js';

export const getAllAbsensiGuru = async (req, res) => {
  try {
    const result = await AbsensiGuruModel.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all absensi guru:', err);
    res.status(500).json({ error: 'Gagal memuat data absensi guru. Silakan coba lagi.' });
  }
};

export const getAbsensiGuruById = async (req, res) => {
  try {
    const result = await AbsensiGuruModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Data absensi guru tidak ditemukan.' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching absensi guru by ID:', err);
    res.status(500).json({ error: 'Gagal memuat data absensi guru. Silakan coba lagi.' });
  }
};

export const getTodayByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // 1) Mapp userId → tutorProfileId
    const tutorRes = await TutorModel.getByUserId(userId);
    if (!tutorRes.rows.length) {
      return res.status(404).json({ error: 'Profile tutor tidak ditemukan.' });
    }
    const tutorProfileId = tutorRes.rows[0].id;

    // 2) Panggil method baru
    const todayRec = await AbsensiGuruModel.getByTutorAndToday(tutorProfileId);
    if (!todayRec.rows.length) {
      return res.status(404).end();  // belum ada record hari ini
    }
    res.json(todayRec.rows[0]);
  } catch (err) {
    console.error('Error fetching today absensi:', err);
    res.status(500).json({ error: 'Gagal memuat absensi hari ini.' });
  }
};

export const checkinGuru = async (req, res) => {
  try {
    const {
      tutor_id: userId,
      tanggal,
      checkin_lat,
      checkin_lng,
      jarak_meter, // Diterima dari AppScript/frontend
      status,      // 'hadir', 'izin', 'sakit', atau 'invalid' dari AppScript
      catatan
    } = req.body;

    // --- 1. Validasi Input Dasar ---
    if (!userId || !tanggal) {
      return res.status(400).json({ error: 'Data tidak lengkap (user atau tanggal).' });
    }
    
    // --- 2. Jika AppScript menandai jarak tidak valid, tolak ---
    if (status === 'invalid') {
      return res.status(400).json({
        error: `Jarak terlalu jauh! Jarak Anda dari sekolah: ${jarak_meter} m.`,
        jarak_meter
      });
    }

    // --- 3. Validasi koordinat hanya jika statusnya 'hadir' ---
    const finalStatus = status || 'hadir';
    if (finalStatus === 'hadir' && (checkin_lat === undefined || checkin_lng === undefined)) {
      return res.status(400).json({ error: 'Koordinat check-in tidak lengkap. Pastikan GPS aktif.' });
    }

    // --- 4. Ambil Profil Tutor ---
    const tutorRes = await TutorModel.getByUserId(userId);
    if (tutorRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profil tutor tidak ditemukan.' });
    }
    const tutorProfileId = tutorRes.rows[0].id;
    
    // --- 5. Cek Absensi yang Sudah Ada ---
    const existing = await AbsensiGuruModel.getByTutorAndTanggal(tutorProfileId, tanggal);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Anda sudah melakukan absensi hari ini.' });
    }

    // --- 6. Buat Payload & Simpan ke Database ---
    const payload = {
      tutor_id: tutorProfileId,
      tanggal,
      checkin_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      checkin_lat: checkin_lat ?? null,
      checkin_lng: checkin_lng ?? null,
      jarak_meter: jarak_meter ?? null,
      status: finalStatus,
      catatan: catatan ?? null
    };

    const result = await AbsensiGuruModel.create(payload);
    return res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('[Check-in Error]', err);
    return res.status(500).json({ error: 'Gagal melakukan check-in. Silakan coba lagi.' });
  } 
};

export const checkoutGuru = async (req, res) => {
  try {
    const result = await AbsensiGuruModel.updateCheckout(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Data absensi guru tidak ditemukan.' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[Check-out Error]', err);
    res.status(500).json({ error: 'Gagal melakukan check-out. Silakan coba lagi.' });
  }
};
