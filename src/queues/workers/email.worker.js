require('module-alias/register');
const { Worker } = require('bullmq');
const redis = require('@config/database/redis');
const { sendMail } = require('@utils/mailer');
const { createLogger } = require('@utils/logger');
const debug = createLogger('xprest:worker');

const worker = new Worker('email', async job => {
  const { to, subject, template, data } = job.data;
  await sendMail({ to, subject, template, data });
}, {
  connection: redis,
});

worker.on('completed', job => debug.info(`✅ Email job ${job.id} done`));
worker.on('failed', (job, err) => debug.error(`❌ Email job ${job.id} failed`, err));
