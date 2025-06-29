const { Queue } = require('bullmq');
const redis = require('@config/database/redis');

function createQueue(name) {
  return new Queue(name, {
    connection: redis,
  });
}

module.exports = { createQueue };
