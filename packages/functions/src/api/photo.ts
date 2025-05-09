import { Hono } from "hono";
import { Photo } from "@wedding-wish/core/photo";
import { Resource } from "sst/resource";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const photoRoute = new Hono();
const s3Client = new S3Client({ region: "eu-north-1" });

photoRoute.post("/upload-url", async (c) => {
  const { weddingId, fileName, contentType } = await c.req.json();
  try {
    const result = await Photo.generateUploadUrl(weddingId, fileName, contentType);
    return c.json(result);
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return c.json({ error: "Failed to generate upload URL" }, 500);
  }
});

photoRoute.get("/wedding/:weddingId", async (c) => {
  const weddingId = c.req.param("weddingId");
  try {
    const photos = await Photo.listPhotosByWeddingId(weddingId);
    return c.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return c.json({ error: "Failed to fetch photos" }, 500);
  }
});

photoRoute.delete("/delete", async (c) => {
  const { key } = await c.req.json();
  try {
    if (!key) {
      return c.json({ error: "Photo key is required" }, 400);
    }

    const command = new DeleteObjectCommand({
      Bucket: Resource.WeddingAssets.name,
      Key: key,
    });

    await s3Client.send(command);
    return c.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return c.json({ error: "Failed to delete photo" }, 500);
  }
});

export default photoRoute;