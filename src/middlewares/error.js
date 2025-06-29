const { any } = require('@utils/logger');

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Internal Server Error';

  any.error(
    `Error: ${message} | ${req.method} ${req.originalUrl} | Status: ${status}`
  );

  if (process.env.NODE_ENV === 'development') {
    res.status(status).json({
      success: false,
      error: {
        code,
        message,
        stack: err.stack
      }
    });
  } else {
    res.status(status).json({
      success: false,
      error: {
        code,
        message
      }
    });
  }
};
