const redis = require('@config/database/redis');

exports.set = (key, value, ttl = 3600) => {
  redis.set(key, JSON.stringify(value), 'EX', ttl);
};

exports.get = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

exports.delete = async (key) => {
  await redis.del(key);
};
