// src/middlewares/checkDistanceMiddleware.js
import fetch from 'node-fetch';

export const checkDistanceWithAppScript = async (req, res, next) => {
  try {
    const { checkin_lat, checkin_lng, status, catatan } = req.body;

    // Check if coordinates are missing
    if (!checkin_lat || !checkin_lng) {
      return res.status(400).json({ error: 'Koordinat check-in tidak lengkap. Pastikan lat dan lng tersedia.' });
    }

    // Call to external API for distance calculation
    const response = await fetch("https://script.google.com/macros/s/AKfycbw76SvrRMzoPvKcwrkq6YbUWnwYZz1o2EdTCJtKm007ywoKW1UE2J5wJLXi2wUYXVGAvA/exec", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        checkin_lat, 
        checkin_lng,
        status,      // Kirim status asli
        catatan      // Kirim catatan asli
      })
    });

    const result = await response.json();

    // Handle API error from App Script
    if (result.error) {
      return res.status(500).json({ error: 'Gagal menghitung jarak dari App Script. Cek koneksi atau coba lagi.' });
    }

    // Add results to the request body for further processing
    req.body.jarak_meter = result.jarak_meter;
    req.body.status = result.status;

    console.log('Hasil dari App Script:', result);

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error('Error in checkDistanceWithAppScript middleware:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan saat menghitung jarak. Silakan coba lagi.' });
  }
};
