# xprest

`xprest` is a REST API starter kit or boilerplate code based on Express.js that is modular, scalable, production-ready and already supports multi-database (MySQL, PostgreSQL, MongoDB), JWT authentication, cache, request validation, and more.

---

## 🚀 Features

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

## 📦 Installation

```bash
git clone https://github.com/your-repo/xprest.git
cd xprest
npm install
```

Create a `.env` file by copying `.env.example`, then configure the database settings. Example using MySQL:

```env
USE_MYSQL=true
DB_PRIMARY=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=xprest
MYSQL_USER=root
MYSQL_PASS=
```

Run the server:
```bash
npm run dev
```

---

## 🔐 Authentication

Endpoints:
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh-token`
- `POST /v1/auth/logout` (requires access token)
- `POST /v1/auth/forgot-password`
- `POST /v1/auth/reset-password`

---

## 😎 User

Endpoints:
- `GET /v1/user` (requires access token)
- `POST /v1/user/:id` (requires access token)
- `POST /v1/user` (requires access token)
- `PUT /v1/user` (requires access token)
- `DELETE /v1/user` (requires access token)
- `GET /v1/user/me` (requires access token)

---

## ⚡ Using Cache

```js
const cache = require('./src/utils/cache');

// Redis
await cache.redis.set('mykey', { name: 'Redis Cache' });
const valueFromRedis = await cache.redis.get('mykey');

// Memory
cache.memory.set('temp', 123, 60); // TTL 60 seconds
const memValue = cache.memory.get('temp');

// File
cache.file.set('user_data', { name: 'File Cache' });
const fileValue = cache.file.get('user_data');
```

---

## 📁 Project Structure

```
src/
├── app.js              # Setup express app
├── index.js            # Entry point
├── controllers/        # Handler request
├── routes/             # Route endpoint
├── services/           # Business logic
├── models/             # DB models (multi-db)
├── config/             # Configuration (DB, mail)
├── utils/              # Utility (Library) Helper (token, logger, dsb)
├── middlewares/        # Middleware global
├── validations/        # Joi schema
├── queues/             # BullMQ worker & job
├── templates/          # Email templates
storages/
├── logs/               # log info, error, & audit
├── uploads/            # uploaded (attachment) file
tests/                  # testing code using JEST
tools/                  # CLI for making controller, service, etc
```

---

## 🧪 Testing

```bash
npm run test
```

---

## 📊 Swagger Docs

Access API documentation at:
```
/docs
```

---

## 🧾 Audit Logging

Every critical user action (like login, update) is logged using Winston into:
```
storages/logs/audit-YYYY-MM-DD.log
```

---

## 📥 Request/Response Format

All responses follow this pattern:
```json
{
  "success": true,
  "data": { ... }
}
```
Errors are formatted like:
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

Use CLI to scaffold modules:
```bash
npm run make:controller User
```

---

## 📧 Email + Queue

Register triggers async email via BullMQ.
Run the worker:
```bash
node src/queues/workers/email.worker.js
```

---

## 🛡️ Rate Limiter

Secure sensitive routes with Redis-backed rate limiter middleware.

---

## ❤️ Contributing

Feel free to open pull requests or issues to contribute to development. If you find this useful, consider starring the repo!

---

MIT License