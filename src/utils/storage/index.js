const path = require('path');
const fs = require('fs');
const { uploadToS3 } = require('./s3');
const { uploadToSFTP } = require('./sftp');
const { uploadToGCS } = require('./gcs');

const STORAGE_DRIVER = process.env.STORAGE_DRIVER || 'local';

async function uploadFile(localFilePath, filename, mimetype) {
  switch (STORAGE_DRIVER) {
    case 's3':
      return await uploadToS3(localFilePath, filename, mimetype);

    case 'sftp':
      return await uploadToSFTP(localFilePath, filename);

    case 'gcs':
      return await uploadToGCS(localFilePath, filename, mimetype);

    case 'local':
    default:
      return {
        path: localFilePath,
        driver: 'local'
      };
  }
}

module.exports = {
  uploadFile
};