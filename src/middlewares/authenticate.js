const jwt = require('jsonwebtoken');
const AppError = require('@utils/AppError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader?.startsWith('Bearer ')) throw new AppError(401, "UNAUTHORIZED", 'Missing or invalid token');

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch {
    throw new AppError(401, "UNAUTHORIZED", 'Invalid or expired token');
  }
};