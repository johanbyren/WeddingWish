import { Hono } from "hono";
import { z } from "zod";
import { GiftRegistry } from "@wedding-wish/core/gift-registry";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const giftSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    url: z.string().url().optional(),
    imageUrl: z.string().url().optional(),
    purchased: z.boolean().default(false),
    purchasedBy: z.string().optional(),
});

/**
 * Create multiple gifts
 */
app.post(
    "/",
    zValidator(
        "json",
        z.object({
            gifts: z.array(giftSchema)
        })
    ),
    async (c) => {
        try {
            console.log('Creating gifts');
            const { gifts } = c.req.valid("json");
            const createdGifts = await GiftRegistry.create(gifts);
            return c.json(createdGifts);
        } catch (error) {
            console.error('Error creating gifts:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Failed to create gifts' }, 500);
        }
    }
);

/**
 * Update gifts
 */
app.put(
    "/",
    zValidator(
        "json",
        z.object({
            updates: z.array(z.object({
                id: z.string(),
                updates: giftSchema.partial()
            }))
        })
    ),
    async (c) => {
        try {
            console.log('Updating gifts');
            const { updates } = c.req.valid("json");
            const updatedGifts = await GiftRegistry.update(updates);
            return c.json(updatedGifts);
        } catch (error) {
            console.error('Error updating gifts:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Failed to update gifts' }, 500);
        }
    }
);

export default app;