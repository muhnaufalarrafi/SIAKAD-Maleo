  // src\index.js
  import express from 'express';
  import cors from 'cors';
  import cookieParser from 'cookie-parser';

  import userRoutes from './routes/userRoutes.js';
  import roleRoutes from './routes/roleRoutes.js';
  import permissionRoutes from './routes/permissionRoutes.js';
  import userRoleRoutes from './routes/userRoleRoutes.js';
  import rolePermissionRoutes from './routes/rolePermissionRoutes.js';
  import userPermissionRoutes from './routes/userPermissionRoutes.js';
  import authRoutes from './routes/authRoutes.js';
  import tutorRoutes from './routes/tutorRoutes.js';
  import siswaRoutes from './routes/siswaRoutes.js';
  import programRoutes from './routes/programRoutes.js';
  import mapelRoutes from './routes/mapelRoutes.js';
  import modulRoutes from './routes/modulRoutes.js';
  import jadwalRoutes from './routes/jadwalRoutes.js';
  import kelasRoutes from './routes/kelasRoutes.js';
  import kelasSiswaRoutes from './routes/kelasSiswaRoutes.js';
  import absensiGuruRoutes from './routes/absensiGuruRoutes.js';
  import absensiSiswaRoutes from './routes/absensiSiswaRoutes.js';
  import eReferenceRoutes from './routes/eReferenceRoutes.js';
  import materiRoutes from './routes/materiRoutes.js';
  import subMateriRoutes from './routes/subMateriRoutes.js';
  import JadwalKelasRoutes from './routes/jadwalKelasRoutes.js'

  const app = express();

  // --- Peningkatan 1: Konfigurasi CORS Dinamis ---
const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001', 
    process.env.FRONTEND_URL // URL frontend production Anda, diatur via Environment Variable
];

const corsOptions = {
    origin: (origin, callback) => {
        // Izinkan request tanpa 'origin' (seperti dari Postman atau mobile apps) atau jika origin ada di daftar
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};
  app.use(cors(corsOptions)); // DIPERBAIKI: Baris ini ditambahkan
  app.use(cookieParser());

    // --- Peningkatan 2: Health Check Endpoint ---
  app.get('/healthz', (req, res) => {
      // Endpoint sederhana untuk memberi tahu Cloud Run bahwa aplikasi sehat
      res.status(200).send('OK');
  });

  // Middleware
  app.use(express.json());
  app.use('/api/users', userRoutes);
  app.use('/api/roles', roleRoutes);
  app.use('/api/permissions', permissionRoutes);
  app.use('/api/user-roles', userRoleRoutes);
  app.use('/api/role-permissions', rolePermissionRoutes);
  app.use('/api/user-permissions', userPermissionRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/tutors', tutorRoutes);
  app.use('/api/siswa', siswaRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/mapel', mapelRoutes);
  app.use('/api/modul', modulRoutes);
  app.use('/api/jadwal', jadwalRoutes);
  app.use('/api/kelas', kelasRoutes);
  app.use('/api/kelas-siswa', kelasSiswaRoutes);
  app.use('/api/absensi-guru', absensiGuruRoutes);
  app.use('/api/absensi-siswa', absensiSiswaRoutes);
  app.use('/api/e-reference', eReferenceRoutes);
  app.use('/api/materi', materiRoutes);
  app.use('/api/sub-materi', subMateriRoutes);
  app.use('/api/jadwal-kelas' , JadwalKelasRoutes)


      // --- Peningkatan 3: Error Handling Terpusat ---
    // Middleware ini HARUS diletakkan setelah semua rute API Anda
    app.use((err, req, res, next) => {
        console.error(err.stack); // Log error ke konsol (untuk debugging)
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan pada server.' 
        });
    });

const PORT = process.env.PORT || 3000//8080; 

// DIUBAH: Gunakan app.listen() langsung, bukan server.listen()
app.listen(PORT, () => {
  // Peningkatan kecil: Gunakan variabel PORT agar log akurat saat di-deploy
  console.log(`Server running on port ${PORT}`);
});