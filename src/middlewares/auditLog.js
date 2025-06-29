const {auditLogger} = require('@utils/logger');

module.exports = function auditLog(action) {
  return (req, res, next) => {
    res.on('finish', () => {
      const user = req.user ? {
        id: req.user.id || null,
        email: req.user.email || null,
        role: req.user.role || null
      } : null;

      auditLogger.info({
        time: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        action,
        user
      });
    });

    next();
  };
};
