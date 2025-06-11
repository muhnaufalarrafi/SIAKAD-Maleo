// src/middlewares/checkDistanceMiddleware.js
import fetch from 'node-fetch';

export const checkDistanceWithAppScript = async (req, res, next) => {
  try {
    const { checkin_lat, checkin_lng } = req.body;

    if (!checkin_lat || !checkin_lng) {
      return res.status(400).json({ error: 'Koordinat tidak lengkap' });
    }

    const response = await fetch("https://script.google.com/macros/s/AKfycbw76SvrRMzoPvKcwrkq6YbUWnwYZz1o2EdTCJtKm007ywoKW1UE2J5wJLXi2wUYXVGAvA/exec", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkin_lat, checkin_lng })
    });

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ error: 'Gagal hitung jarak dari App Script' });
    }

    // Tambahkan hasil ke req.body untuk diproses lanjut
    req.body.jarak_meter = result.jarak_meter;
    req.body.status = result.status;
    console.log('Hasil dari App Script:', result);
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error saat menghitung jarak' });
  }
};
