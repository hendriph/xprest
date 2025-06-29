const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE_PATH
});

const bucketName = process.env.GCS_BUCKET_NAME;

async function uploadToGCS(localFilePath, filename, mimetype) {
  const bucket = storage.bucket(bucketName);
  const options = {
    destination: filename,
    metadata: {
      contentType: mimetype
    }
  };

  try {
    await bucket.upload(localFilePath, options);
    const file = bucket.file(filename);
    const [metadata] = await file.getMetadata();
    return {
      url: metadata.mediaLink || file.publicUrl(),
      bucket: bucketName,
      name: filename
    };
  } catch (err) {
    console.error('GCS Upload Error:', err);
    throw err;
  }
}

module.exports = {
  uploadToGCS
};