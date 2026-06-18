import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const r2AccountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const r2AccessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const r2SecretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "grace-coloring-media";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

export async function uploadToR2(
  file: File,
  path: string
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await s3.send(
    new PutObjectCommand({
      Bucket: r2BucketName,
      Key: path,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `https://${r2AccountId}.r2.cloudflarestorage.com/${r2BucketName}/${path}`;
}

export async function deleteFromR2(path: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: r2BucketName,
      Key: path,
    })
  );
}

export async function listR2Objects(prefix: string): Promise<string[]> {
  const response = await s3.send(
    new ListObjectsV2Command({
      Bucket: r2BucketName,
      Prefix: prefix,
    })
  );

  return (response.Contents || []).map((obj) => obj.Key || "");
}

export { r2BucketName };
