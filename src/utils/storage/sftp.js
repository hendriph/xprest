const Client = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

const sftp = new Client();

async function uploadToSFTP(localFilePath, filename) {
  const remotePath = path.posix.join(process.env.SFTP_REMOTE_PATH || '/', filename);

  try {
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT || 22,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD
    });

    await sftp.put(localFilePath, remotePath);
    await sftp.end();

    return {
      path: remotePath,
      host: process.env.SFTP_HOST
    };
  } catch (err) {
    console.error('SFTP Upload Error:', err);
    throw err;
  }
}

module.exports = {
  uploadToSFTP
};