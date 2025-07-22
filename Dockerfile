# Gunakan base image Node.js versi Long-Term Support (LTS) yang ringan
FROM node:20-slim

# Tetapkan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan cache Docker, sehingga 'npm install' tidak selalu dijalankan
COPY package*.json ./

# Instal hanya dependensi produksi untuk menjaga ukuran image tetap kecil
RUN npm install --production

# Salin sisa kode aplikasi Anda ke dalam container
COPY . .

# Ekspos port yang didengarkan oleh aplikasi Anda.
EXPOSE 8080

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD [ "npm", "start" ]