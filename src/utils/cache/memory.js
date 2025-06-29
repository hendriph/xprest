const NodeCache = require('node-cache');
const memory = new NodeCache({ stdTTL: 600 }); // 10 menit

module.exports = {
  get: (key) => memory.get(key),
  set: (key, value, ttl) => memory.set(key, value, ttl),
  del: (key) => memory.del(key)
};
