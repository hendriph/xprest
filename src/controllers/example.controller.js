const path = require('path');
const fs = require('fs');
const File = require('@models/file.model');
const { Storage } = require('@google-cloud/storage');
const AWS = require('aws-sdk');
const Client = require('ssh2-sftp-client');
const { saveFileMetadata } = require('@utils/file');
const { uploadFile } = require('@utils/storage');
const AppError = require('@utils/AppError');

exports.mwUploadSingle = async (req, res) => {
  try {
    if (!req.file) throw new AppError(400, "BAD_REQUEST", 'No files uploaded');

    const metadata = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      storage: 'local'
    };

    await saveFileMetadata(metadata);
    res.success(metadata);
  } catch (err) {
    throw new AppError(500, "INTERNAL_SERVER_ERROR", err.message);
  }
};

exports.mwUploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError(400, "BAD_REQUEST", 'No files uploaded');
    }

    const fileList = await Promise.all(req.files.map(async (file) => {
      const metadata = {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        storage: 'local'
      };
      await saveFileMetadata(metadata);
      return metadata;
    }));

    res.success({ files: fileList });
  } catch (err) {
    throw new AppError(500, "INTERNAL_SERVER_ERROR", err.message);
  }
};

exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) throw new AppError(400, "BAD_REQUEST", 'No files uploaded');

    const storageResult = await uploadFile(
      req.file.path,
      req.file.filename,
      req.file.mimetype
    );

    const metadata = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: storageResult.path || storageResult.url,
      storage: process.env.STORAGE_DRIVER || 'local'
    };

    await saveFileMetadata(metadata);
    res.success(metadata);
  } catch (err) {
    throw new AppError(500, "INTERNAL_SERVER_ERROR", err.message);
  }
};

exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError(400, "BAD_REQUEST", 'No files uploaded');
    }

    const fileList = await Promise.all(req.files.map(async (file) => {
      const storageResult = await uploadFile(
        file.path,
        file.filename,
        file.mimetype
      );

      const metadata = {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: storageResult.path || storageResult.url,
        storage: process.env.STORAGE_DRIVER || 'local'
      };

      await saveFileMetadata(metadata);
      return metadata;
    }));

    res.success({ files: fileList });
  } catch (err) {
    throw new AppError(500, "INTERNAL_SERVER_ERROR", err.message);
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const fileRecord = await File.findOne({ where: { filename } });

    if (!fileRecord) throw new AppError(404, "NOT_FOUND", 'File not found');

    const driver = fileRecord.storage || 'local';

    if (driver === 'local') {
      const filePath = path.resolve(fileRecord.path);
      if (!fs.existsSync(filePath)) throw new AppError(404, "NOT_FOUND", 'File not found on local');
      return res.download(filePath, fileRecord.originalname);
    }

    if (driver === 's3') {
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION
      });

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename
      };

      const stream = s3.getObject(params).createReadStream();
      res.setHeader('Content-Disposition', `attachment; filename="\${fileRecord.originalname}"`);
      return stream.pipe(res);
    }

    if (driver === 'sftp') {
      const sftp = new Client();
      await sftp.connect({
        host: process.env.SFTP_HOST,
        port: process.env.SFTP_PORT || 22,
        username: process.env.SFTP_USERNAME,
        password: process.env.SFTP_PASSWORD
      });

      const remotePath = fileRecord.path;
      const stream = await sftp.get(remotePath);
      res.setHeader('Content-Disposition', `attachment; filename="\${fileRecord.originalname}"`);
      stream.pipe(res);
      stream.on('end', () => sftp.end());
      return;
    }

    if (driver === 'gcs') {
      const storage = new Storage({
        projectId: process.env.GCS_PROJECT_ID,
        keyFilename: process.env.GCS_KEYFILE_PATH
      });

      const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
      const file = bucket.file(filename);
      const stream = file.createReadStream();
      res.setHeader('Content-Disposition', `attachment; filename="\${fileRecord.originalname}"`);
      return stream.pipe(res);
    }

    return res.status(400).json({ message: 'Unsupported storage driver' });
  } catch (err) {
    throw new AppError(500, "INTERNAL_SERVER_ERROR", 'Download Failed');
  }
};