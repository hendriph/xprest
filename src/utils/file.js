const File = require('@models/file.model');
const {uploadLogs} = require('@utils/logger');
const AppError = require('@utils/AppError');

async function saveFileMetadata(fileData) {
  try {
    return await File.create(fileData);
  } catch (err) {
    uploadLogs.error('Error saving file metadata:', err.message);
    throw new AppError(500, "INTERNAL_SERVER_ERROR", err.message);
  }
}

module.exports = {
  saveFileMetadata
};