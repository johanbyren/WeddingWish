import { Hono } from "hono";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";

const s3Client = new S3Client({ region: "eu-north-1" });

export const photoRoute = new Hono();

photoRoute.post("/upload-url", async (c) => {
  try {
    const { weddingId, fileName, contentType } = await c.req.json();
    
    const key = `weddings/${weddingId}/${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: Resource.WeddingAssets.name,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return c.json({ 
      signedUrl,
      key 
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return c.json({ error: "Failed to generate upload URL" }, 500);
  }
}); 

export default photoRoute;