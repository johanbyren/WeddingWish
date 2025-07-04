import { Hono } from "hono";
import { z } from "zod";
import { GiftRegistry } from "@wedding-wish/core/gift-registry";
import { Photo } from "@wedding-wish/core/photo";
import { zValidator } from "@hono/zod-validator";
import { Resource } from "sst";

const app = new Hono();

const giftSchema = z.object({
    id: z.string(),
    weddingId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    imageUrl: z.string().optional(),
    totalContributed: z.number().default(0),
    isFullyFunded: z.boolean().default(false),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Create gifts
 */
app.post(
  "/",
  zValidator(
    "json",
    z.object({
      gifts: z.array(
        z.object({
          id: z.string(),
          weddingId: z.string(),
          name: z.string(),
          description: z.string().optional(),
          price: z.number(),
          imageUrl: z.string().optional(),
          totalContributed: z.number().default(0),
          isFullyFunded: z.boolean().default(false),
        })
      ),
    })
  ),
  async (c) => {
    try {
      const { gifts } = c.req.valid("json");
      console.log('Creating gifts:', gifts);
      
      // Create the gifts in DynamoDB
      const createdGifts = await GiftRegistry.create(gifts.map(gift => ({
        ...gift,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })));
      console.log('Created gifts in DynamoDB:', createdGifts);

      return c.json(createdGifts);
    } catch (error) {
      console.error("Error creating gifts:", error);
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Failed to create gifts" }, 500);
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

/**
 * Generate upload URL for gift photo
 */
app.post(
    "/photo-upload-url",
    zValidator(
        "json",
        z.object({
            giftId: z.string(),
            fileName: z.string(),
            contentType: z.string()
        })
    ),
    async (c) => {
        try {
            const { giftId, fileName, contentType } = c.req.valid("json");
            const result = await Photo.generateGiftPhotoUploadUrl(giftId, fileName, contentType);
            return c.json(result);
        } catch (error) {
            console.error('Error generating photo upload URL:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Failed to generate photo upload URL' }, 500);
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

/**
 * Delete a gift
 */
app.delete(
    "/:giftId/:weddingId",
    async (c) => {
        try {
            const giftId = c.req.param("giftId");
            const weddingId = c.req.param("weddingId");
            
            await GiftRegistry.deleteGift(giftId, weddingId);
            return c.json({ success: true });
        } catch (error) {
            console.error('Error deleting gift:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Failed to delete gift' }, 500);
        }
    }
);

export default app;