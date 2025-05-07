import { Hono } from "hono";
import { z } from "zod";
import { Wedding } from "@wedding-wish/core/wedding";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

/**
 * Create a wedding
 */
app.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const result = await Wedding.create(body);
        return c.json(result);
    } catch (error) {
        console.error("Error creating wedding:", error);
        return c.json({ error: "Failed to create wedding" }, 500);
    }
});

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

/**
 * Delete a wedding
 */
app.delete(
    "/",
    zValidator(
        "json",
        z.object({
            weddingId: z.string(),
            userId: z.string(),
        }),
    ),
    async (c) => {
        try {
            const { weddingId, userId } = c.req.valid("json");
            await Wedding.deleteWedding(weddingId, userId);
            return c.json({ message: "Wedding deleted successfully" });
        } catch (error) {
            console.error("Error deleting wedding:", error);
            return c.json({ error: "Failed to delete wedding" }, 500);
        }
    },
);

export default app;