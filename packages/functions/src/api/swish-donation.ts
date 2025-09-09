import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { SwishDonations } from "@wedding-wish/core/swish";
import { GiftRegistry } from "@wedding-wish/core/gift-registry";

const app = new Hono();

// Schema for Swish donation data
const swishDonationSchema = z.object({
  weddingId: z.string(),
  giftId: z.string(),
  amount: z.number().positive(),
  donorName: z.string().optional(),
  message: z.string().optional(),
  phone: z.string(),
});

app.post(
  "/",
  zValidator("json", swishDonationSchema),
  async (c) => {
    try {
      const donationData = c.req.valid("json");
      
      console.log("Saving Swish donation:", donationData);
      
      // Save the donation to DynamoDB
      const savedDonation = await SwishDonations.save({
        weddingId: donationData.weddingId,
        giftId: donationData.giftId,
        amount: donationData.amount,
        donorName: donationData.donorName,
        message: donationData.message,
        phone: donationData.phone,
      });
      
      console.log("Swish donation saved successfully:", savedDonation);
      
      // Update the gift registry with the contribution
      try {
        const updatedGift = await GiftRegistry.addContribution(
          donationData.giftId,
          donationData.weddingId,
          donationData.amount
        );
        console.log("Gift registry updated successfully:", updatedGift);
      } catch (giftError) {
        console.error("Failed to update gift registry:", giftError);
        // Don't fail the entire request if gift update fails, but log the error
        // The donation is still saved, just the progress won't be updated
      }
      
      return c.json({
        success: true,
        donation: savedDonation,
      });
    } catch (error) {
      console.error("Error saving Swish donation:", error);
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to save donation",
        },
        500
      );
    }
  }
);

export default app;
