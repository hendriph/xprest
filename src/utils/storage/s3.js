const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

const S3_BUCKET = process.env.S3_BUCKET_NAME;

async function uploadToS3(localFilePath, filename, mimetype) {
  const fileContent = fs.readFileSync(localFilePath);

  const params = {
    Bucket: S3_BUCKET,
    Key: filename,
    Body: fileContent,
    ContentType: mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return {
      url: data.Location,
      key: data.Key,
      bucket: data.Bucket
    };
  } catch (err) {
    console.error('S3 Upload Error:', err);
    throw err;
  }
}

module.exports = {
  uploadToS3
};