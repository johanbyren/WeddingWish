import { Hono } from "hono";
import { GiftRegistry } from "@wedding-wish/core/gift-registry";
import { Photo } from "@wedding-wish/core/photo";

const app = new Hono();

/**
 * Get all gifts for a wedding
 */
app.get(
    "/wedding/:weddingId",
    async (c) => {
        try {
            const weddingId = c.req.param("weddingId");
            const gifts = await GiftRegistry.getByWeddingId(weddingId);

            // Get signed URLs for gift images
            const giftsWithUrls = await Promise.all(
                gifts.map(async (gift) => {
                    let imageUrl = null;
                    if (gift.imageUrl) {
                        try {
                            const { url } = await Photo.getGiftPhotoByFileName(gift.imageUrl);
                            imageUrl = url;
                        } catch (error) {
                            console.error('Error getting gift image URL:', error);
                        }
                    }
                    return {
                        ...gift,
                        imageUrl
                    };
                })
            );

            return c.json(giftsWithUrls);
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
