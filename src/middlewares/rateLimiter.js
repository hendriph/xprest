const rateLimit = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const redisClient = require('@config/database/redis');

const limiter = (options = {}) =>
  rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: options.prefix || 'rl:',
    }),
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 5,
    message: {
      error: { message: 'Too many requests, please try again later.' }
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

module.exports = limiter;
