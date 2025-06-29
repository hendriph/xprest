const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const mailConfig = require('../config/mail');

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

async function sendMail({ to, subject, template, data }) {
  const templatePath = path.resolve(__dirname, '../templates/emails', `${template}.ejs`);
  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: mailConfig.from,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
