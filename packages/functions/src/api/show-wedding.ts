import { Hono } from "hono";
import { z } from "zod";
import { Wedding } from "@wedding-wish/core/wedding";
import { Photo } from "@wedding-wish/core/photo";
import { zValidator } from "@hono/zod-validator";
import { Resource } from "sst";

const app = new Hono();

/**
 * Get a wedding by ID
 */
app.get(
    "/:slug",
    zValidator(
        "param",
        z.object({
            slug: z.string(),
        }),
    ),
    async (c) => {
        try {
            const { slug } = c.req.valid("param");
            const wedding = await Wedding.getById(slug);
            if (!wedding) {
                console.log("API: No wedding found for id:", slug);
                return c.json({ error: "Wedding not found" }, 404);
            }

            // Get signed URLs for all photos
            const photoUrls = await Promise.all(
                (wedding.photoUrls || []).map(async (key) => {
                    try {
                        const { url } = await Photo.getByFileName(key);
                        return url;
                    } catch (error) {
                        console.error("Error getting signed URL for photo:", error);
                        return key; // Return the original key if getting signed URL fails
                    }
                })
            );

            return c.json({
                ...wedding,
                photoUrls
            });
        } catch (error) {
            console.error("API: Error fetching wedding by id:", error);
            return c.json({ error: "Failed to fetch wedding" }, 500);
        }
    },
);

/**
 * Get a wedding by custom URL
 */
app.get(
    "/custom-url/:customUrl",
    zValidator(
        "param",
        z.object({
            customUrl: z.string(),
        }),
    ),
    async (c) => {
        try {
            const { customUrl } = c.req.valid("param");
            const wedding = await Wedding.getByCustomUrl(customUrl);
            if (!wedding) {
                return c.json({ error: "Wedding not found" }, 404);
            }

            // Get signed URLs for all photos
            const photoUrls = await Promise.all(
                (wedding.photoUrls || []).map(async (key) => {
                    try {
                        const { url } = await Photo.getByFileName(key);
                        return url;
                    } catch (error) {
                        console.error("Error getting signed URL for photo:", error);
                        return key; // Return the original key if getting signed URL fails
                    }
                })
            );

            return c.json({
                ...wedding,
                photoUrls
            });
        } catch (error) {
            console.error("Error fetching wedding:", error);
            return c.json({ error: "Failed to fetch wedding" }, 500);
        }
    },
);

export default app; 