  // src\index.js
  import express from 'express';
  import http from 'http';
  import { Server } from 'socket.io';
  import cors from 'cors';
  import socketHandlers from './events/socketHandlers.js';

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
  import kelasSiswaRoutes from './routes/kelasSiswaRoutes.js';
  import absensiGuruRoutes from './routes/absensiGuruRoutes.js';
  import absensiSiswaRoutes from './routes/absensiSiswaRoutes.js';
  import eReferenceRoutes from './routes/eReferenceRoutes.js';
  import materiRoutes from './routes/materiRoutes.js';
  import subMateriRoutes from './routes/subMateriRoutes.js';

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // lebih aman bisa spesifik origin frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    }
  });

  // sebelum route API
  app.use(cors({
  // origin: '*', // untuk development, boleh pakai '*'
    origin: ['http://localhost:3000', 'http://localhost:3001'], // lebih aman bisa spesifik origin frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // tambahkan header yang dipakai di request
  }));


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
  app.use('/api/kelas-siswa', kelasSiswaRoutes);
  app.use('/api/absensi-guru', absensiGuruRoutes);
  app.use('/api/absensi-siswa', absensiSiswaRoutes);
  app.use('/api/e-reference', eReferenceRoutes);
  app.use('/api/materi', materiRoutes);
  app.use('/api/sub-materi', subMateriRoutes);


  // Socket.io event handlers
  io.on('connection', (socket) => { 
    console.log('Client connected:', socket.id);
    socketHandlers(socket, io);
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
