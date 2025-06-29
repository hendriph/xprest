const redis = require('@config/database/redis');

const TOKEN_PREFIX = 'refreshToken:';

exports.storeRefreshToken = async (userId, token) => {
  let ttl;
  switch (process.env.JWT_REFRESH_EXPIRED_FORMAT) {
    case 'd':
      ttl = 60 * 60 * 24 * parseInt(process.env.JWT_REFRESH_EXPIRED)
      break;
    case 'h':
      ttl = 60 * 60 * parseInt(process.env.JWT_REFRESH_EXPIRED);
      break;
    case 'm':
      ttl = 60 * parseInt(process.env.JWT_REFRESH_EXPIRED);
      break;
    default:
      // in seconds
      ttl = parseInt(process.env.JWT_REFRESH_EXPIRED);
      break;
  }
  await redis.set(`${TOKEN_PREFIX}${userId}`, token, 'EX', ttl);
};

exports.getRefreshToken = async (userId) => {
  return await redis.get(`${TOKEN_PREFIX}${userId}`);
};

exports.revokeRefreshToken = async (userId) => {
  await redis.del(`${TOKEN_PREFIX}${userId}`);
};
