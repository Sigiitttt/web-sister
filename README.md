# 🌋 SISTEM PENDAKIAN — Dockerized Fullstack App

Project ini terdiri dari:

* **Backend** → Laravel (PHP 8.3, MySQL)
* **Frontend** → React + Vite
* **Database** → MySQL 8
* **Database Viewer** → phpMyAdmin
* **Docker** → Multi-Service Development Environment

Panduan ini menjelaskan cara **clone, setup, dan menjalankan aplikasi** menggunakan Docker tanpa perlu menginstal PHP, Composer, atau Node.js.

---

# 🚀 1. Persyaratan Sistem

Pastikan menginstal:

* **Docker Desktop** → [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
* Git (optional untuk clone repo)

> Aplikasi **TIDAK membutuhkan** PHP, Composer, Node, MySQL di komputer lokal.

---

# 📥 2. Clone Project

Jalankan perintah:

```sh
git clone <REPOSITORY_URL>
cd sister-pendakian
```

Jika menerima ZIP, cukup extract lalu masuk folder:

```sh
cd sister-pendakian
```

---

# ⚙️ 3. Struktur Project

```
sister-pendakian/
│
├── backend/        → Laravel API
├── frontend/       → React + Vite
├── docker-compose.yml
└── README.md
```

---

# 🐳 4. Jalankan Semua Service (Docker)

Di root folder project:

```sh
docker-compose up --build
```

Docker akan membuat container:

| Service                     | URL                                            |
| --------------------------- | ---------------------------------------------- |
| **Frontend (React + Vite)** | [http://localhost:5173](http://localhost:5173) |
| **Backend API (Laravel)**   | [http://localhost:8000](http://localhost:8000) |
| **phpMyAdmin**              | [http://localhost:8080](http://localhost:8080) |
| **MySQL DB**                | berjalan di dalam container                    |

---

# 🔧 5. Setup Backend (Laravel)

Setelah semua container aktif, masuk ke container backend:

```sh
docker exec -it pendakian-backend bash
```

Jalankan setup Laravel:

```sh
php artisan key:generate
php artisan migrate --seed
php artisan config:clear
```

Keluar:

```sh
exit
```

---

# 🗄️ 6. Database Info

Gunakan konfigurasi berikut jika login ke phpMyAdmin:

| Setting  | Value             |
| -------- | ----------------- |
| Host     | `pendakian-mysql` |
| User     | `root`            |
| Password | `password`        |
| Database | `pendakian_db`    |

---

# 🌐 7. Cara Akses Aplikasi

* **Frontend** → [http://localhost:5173](http://localhost:5173)
* **Backend (API)** → [http://localhost:8000](http://localhost:8000)
* **phpMyAdmin (DB Viewer)** → [http://localhost:8080](http://localhost:8080)

---

# 🔁 8. Menghentikan Container

Untuk stop:

```sh
docker-compose down
```

---

# 🧹 9. Menghapus dan Rebuild Ulang (jika error besar)

```sh
docker-compose down -v
docker-compose up --build
```

---

# 🤝 10. Kontribusi / Troubleshooting

### Error: `SQLSTATE[HY000] [2002] Connection refused`

✔ Pastikan `DB_HOST` pada `backend/.env` adalah:

```
DB_HOST=pendakian-mysql
```

### Error: tabel `sessions` tidak ada

Jalankan ulang:

```
docker exec -it pendakian-backend bash
php artisan migrate --seed
```
