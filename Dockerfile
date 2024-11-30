# Gunakan base image Node.js berbasis Alpine untuk ukuran lebih kecil
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies (hanya untuk production)
RUN npm install --production

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Ekspos port yang akan digunakan oleh aplikasi
EXPOSE 8080

# Set environment variable untuk Google Cloud Run
ENV PORT=8080

# Jalankan aplikasi
CMD ["npm","run", "start"]
