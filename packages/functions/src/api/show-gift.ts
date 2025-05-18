import { Hono } from "hono";
import { GiftRegistry } from "@wedding-wish/core/gift-registry";
import { Photo } from "@wedding-wish/core/photo";

const app = new Hono();

/**
 * Get a specific gift by ID
 */
app.get(
    "/:giftId",
    async (c) => {
        try {
            const giftId = c.req.param("giftId");
            const weddingId = c.req.query("weddingId");

            if (!weddingId) {
                return c.json({ error: "weddingId is required" }, 400);
            }

            const gift = await GiftRegistry.getById(giftId, weddingId);

            if (!gift) {
                return c.json({ error: "Gift not found" }, 404);
            }

            // Get signed URL for gift image if it exists
            let imageUrl = null;
            if (gift.imageUrl) {
                try {
                    const { url } = await Photo.getGiftPhotoByFileName(gift.imageUrl);
                    imageUrl = url;
                } catch (error) {
                    console.error('Error getting gift image URL:', error);
                }
            }

            return c.json({
                ...gift,
                imageUrl
            });
        } catch (error) {
            console.error('Error fetching gift:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Failed to fetch gift' }, 500);
        }
    }
);

/**
 * Get all gifts for a wedding
 */
app.get(
    "/wedding/:weddingId",
    async (c) => {
        try {
            const weddingId = c.req.param("weddingId");
            const gifts = await GiftRegistry.getByWeddingId(weddingId);

            // Return gifts with their existing imageUrl from DynamoDB
            return c.json(gifts);
        } catch (error) {
            console.error('Error fetching gifts:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Failed to fetch gifts' }, 500);
        }
    }
);

export default app;
