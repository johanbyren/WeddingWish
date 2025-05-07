import { Hono } from "hono";
import { Photo } from "@wedding-wish/core/photo";

export const photoRoute = new Hono();

photoRoute.post("/upload-url", async (c) => {
  try {
    const { weddingId, fileName, contentType } = await c.req.json();
    
    const result = await Photo.generateUploadUrl(weddingId, fileName, contentType);
    return c.json(result);
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return c.json({ error: "Failed to generate upload URL" }, 500);
  }
}); 

export default photoRoute;