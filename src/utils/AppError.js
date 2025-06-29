class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status || 500;
    this.code = code || 'INTERNAL_SERVER_ERROR';
  }
}

module.exports = AppError;
