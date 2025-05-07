import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Photo } from "@wedding-wish/core/photo";

const app = new Hono();

/**
 * Get a photo by key
 */
app.get(
    "/:type/:id/:fileName",
    async (c) => {
        try {
            console.log("API: Processing photo request");
            const type = c.req.param("type");
            const id = c.req.param("id");
            const fileName = c.req.param("fileName");


            console.log("API: Type:", type);
            console.log("API: ID:", id);
            console.log("API: File name:", fileName);
            console.log("API: Headers:", c.req.header());
            
            const photo = await Photo.getByFileName(`${type}/${id}/${fileName}`);
            
            if (!photo) {
                console.log("API: No photo found for path:", `${type}/${id}/${fileName}`);
                return c.json({ error: "Photo not found" }, 404);
            }

            return c.json({ url: photo.url });
        } catch (error) {
            console.error("API: Error fetching photo:", error);
            return c.json({ error: "Failed to fetch photo" }, 500);
        }
    },
);

export default app;
