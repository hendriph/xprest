const { createQueue } = require('@utils/queue');

const emailQueue = createQueue('email');

async function queueEmail(data) {
  await emailQueue.add('sendEmail', data);
}

module.exports = { queueEmail };
