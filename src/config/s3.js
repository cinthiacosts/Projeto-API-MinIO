const {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  forcePathStyle: true
});

const bucketName = process.env.S3_BUCKET;

async function garantirBucket() {
  try {
    await s3.send(
      new HeadBucketCommand({
        Bucket: bucketName
      })
    );

    console.log("Bucket já existe:", bucketName);
  } catch (erro) {
    await s3.send(
      new CreateBucketCommand({
        Bucket: bucketName
      })
    );

    console.log("Bucket criado:", bucketName);
  }
}

module.exports = {
  s3,
  bucketName,
  garantirBucket
};