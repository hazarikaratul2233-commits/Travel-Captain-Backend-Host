import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file, location) => {
  const cleanName = file.originalname.replace(/\s+/g, '');
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${location}${Date.now()}-${cleanName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${process.env.CLOUDFRONT_DISTRIBUTION_NAME}/${params.Key}`;
};

