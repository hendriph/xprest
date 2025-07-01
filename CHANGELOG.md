# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-07-01

### Added
Initial Release :
- JWT Auth system (Login, Register, Refresh, Logout)
- Role-based access control (RBAC)
- CLI Generator (make:controller)
- Redis cache, memory cache, and file cache support
- Email service + BullMQ queue
- Audit logging using Winston + daily rotate
- Rate limiter middleware with Redis store
- Swagger YAML docs at `/docs`
- AppError class & standardized API response (`res.success`)
- Jest + Supertest test coverage for auth, user, rbac, queue
- File upload & storage via local
- Multi-database support (MySQL, PostgreSQL, MongoDB)
