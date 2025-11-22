# Gunakan base image Node.js
FROM node:22-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh kode frontend
COPY . .

# Expose port yang digunakan Vite (default 5173)
EXPOSE 5173

# Jalankan aplikasi dalam mode development (agar teman Anda bisa coding juga)
# Tambahkan --host agar bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]