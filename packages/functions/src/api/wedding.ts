import { Hono } from "hono";
import { z } from "zod";
import { Wedding } from "@wedding-wish/core/wedding";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

/**
 * Create a wedding
 */
app.post(
    "/",
    zValidator(
        "json",
        z.object({
            weddingId: z.string(),
            userId: z.string(),
            title: z.string().optional(),
            date: z.string().optional(),
            location: z.string().optional(),
            story: z.string().optional(),
            coverPhotoKey: z.string().optional(),
            additionalPhotoKeys: z.array(z.string()).optional(),
            visibility: z.string().optional(),
            customUrl: z.string().optional(),
            theme: z.string().optional(),
            primaryColor: z.string().optional(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional(),
        }),
    ),
    async (c) => {
        const validated = c.req.valid("json");
        const wedding = await Wedding.create(validated);
        return c.json(wedding);
    },
);

/**
 * Get all weddings for a user (userId = email)
 */
app.get(
    "/:userId",
    zValidator(
        "param",
        z.object({
            userId: z.string(),
        }),
    ),
    async (c) => {
        const { userId } = c.req.valid("param");
        const weddings = await Wedding.listWeddingsByUserId(userId);
        return c.json(weddings);
    },
);

export default app;