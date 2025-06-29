# xprest
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Test](https://img.shields.io/badge/test-coverage-90%25-yellowgreen)

`xprest` adalah REST API starter kit atau boilerplate code berbasis Express.js yang modular, scalable, siap produksi dan sudah mendukung multi-database (MySQL, PostgreSQL, MongoDB), autentikasi JWT, cache, validasi request, dan lainnya.

---

## ✨ Fitur Utama

- 🔐 JWT Auth (Login, Register, Refresh, Logout)
- 🔄 Role-based Access Control (RBAC)
- 🗂️ Struktur modular (controller, service, validation)
- ⚡ Caching (Redis, Memory, File)
- 📬 Email + Queue dengan BullMQ
- 📁 Upload & storage support
- 🔐 Rate Limiter & Error Formatter
- 🧾 Audit Logger (winston + rotate)
- 📊 Swagger OpenAPI Docs
- 🧪 Testing (Jest + Supertest)
- 🛠️ CLI Generator (make:controller)

---

## 📦 Instalasi

```bash
git clone https://github.com/your-repo/xprest.git
cd xprest
npm install
```

Buat file `.env` dari `.env.example` lalu isi konfigurasi database yang ingin digunakan. Misalnya untuk MySQL:

```env
USE_MYSQL=true
DB_PRIMARY=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=xprest
MYSQL_USER=root
MYSQL_PASS=
```

Jalankan server:
```bash
npm run dev
```

---

## 🔐 Autentikasi

Endpoint:
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh-token`
- `POST /v1/auth/logout` (butuh token akses)
- `POST /v1/auth/forgot-password`
- `POST /v1/auth/reset-password`

---

## 😎 User

Endpoints:
- `GET /v1/user` (butuh token akses)
- `POST /v1/user/:id` (butuh token akses)
- `POST /v1/user` (butuh token akses)
- `PUT /v1/user` (butuh token akses)
- `DELETE /v1/user` (butuh token akses)
- `GET /v1/user/me` (butuh token akses)

---

## ⚡ Cara Menggunakan Cache

```js
const cache = require('./src/utils/cache');

// Redis
await cache.redis.set('mykey', { name: 'Redis Cache' });
const valueFromRedis = await cache.redis.get('mykey');

// Memory
cache.memory.set('temp', 123, 60); // TTL 60 detik
const memValue = cache.memory.get('temp');

// File
cache.file.set('user_data', { name: 'File Cache' });
const fileValue = cache.file.get('user_data');
```

---

## 📁 Struktur Folder

```
src/
├── app.js              # Setup express app
├── index.js            # Entry point
├── controllers/        # Handler request
├── routes/             # Route endpoint
├── services/           # Business logic
├── models/             # DB models (multi-db)
├── config/             # Konfigurasi (DB, mail)
├── utils/              # Helper util (token, logger, dsb)
├── middlewares/        # Middleware global
├── validations/        # Joi schema
├── queues/             # BullMQ worker & job
├── templates/          # Email templates
storages/
├── logs/               # log info, error, & audit
├── uploads/            # file yang diupload
tests/                  # kode tes menggunakan jest
tools/                  # CLI membuat controller, service, dll
```

---

## 🧪 Testing

```bash
npm run test
```

---

## 📊 Swagger Docs

Dokumentasi API tersedia di:
```
/docs
```

---

## 🧾 Audit Logging

Setiap aksi penting pengguna (login, update, dll) dicatat ke file log via Winston:
```
storages/logs/audit-YYYY-MM-DD.log
```

---

## 📥 Format Response

Format standar response:
```json
{
  "success": true,
  "data": { ... }
}
```

Format error:
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

---

## ⚙️ CLI Generator

Gunakan CLI untuk generate modul:
```bash
npm run make:controller User
```

---

## 📧 Email + Queue

Proses register akan kirim email via BullMQ.
Jalankan worker dengan:
```bash
node src/queues/workers/email.worker.js
```

---

## 🛡️ Rate Limiter

Gunakan middleware rate limiter berbasis Redis untuk melindungi endpoint sensitif.

---

## ❤️ Kontribusi

Pull request dan issue sangat diterima untuk pengembangan lebih lanjut. Jangan lupa bintangin repo ini kalau kamu suka!

---

MIT License