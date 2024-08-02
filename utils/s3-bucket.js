import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getObjectURL({ Bucket, Key }) {
  const command = new GetObjectCommand({ Bucket, Key });
  const url = await getSignedUrl(s3Client, command);
  return { [Key]: url };
}

export async function putObjectURL({ Bucket, Key, Body }) {
  const command = new PutObjectCommand({ Bucket, Key, Body });
  const url = await getSignedUrl(s3Client, command);
  return { [Key]: url };
}
