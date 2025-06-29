const redis = require('@config/database/redis');

const RESET_PREFIX = 'resetToken:';

exports.setResetToken = async (userId, token) => {
  let ttl;
  switch (process.env.JWT_ACCESS_EXPIRED_FORMAT) {
    case 'd':
      ttl = 60 * 60 * 24 * parseInt(process.env.JWT_ACCESS_EXPIRED);
      break;
    case 'h':
      ttl = 60 * 60 * parseInt(process.env.JWT_ACCESS_EXPIRED);
      break;
    case 'm':
      ttl = 60 * parseInt(process.env.JWT_ACCESS_EXPIRED);
      break;
    default:
      // in seconds
      ttl = parseInt(process.env.JWT_ACCESS_EXPIRED);
      break;
  }
  await redis.set(`${RESET_PREFIX}${userId}`, token, 'EX', ttl);
};

exports.getResetToken = async (userId) => {
  return await redis.get(`${RESET_PREFIX}${userId}`);
};

exports.clearResetToken = async (userId) => {
  await redis.del(`${RESET_PREFIX}${userId}`);
};
