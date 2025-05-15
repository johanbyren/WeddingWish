import { z } from "zod";

// Schema for individual contributions to a gift
export const giftContributionSchema = z.object({
  id: z.string(),
  giftId: z.string(),
  contributorId: z.string(), // User ID or email of the contributor
  contributorName: z.string(), // Name of the contributor
  amount: z.number(), // Amount contributed
  message: z.string().optional(), // Optional message from the contributor
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Schema for the gift itself
export const schema = z.object({
  id: z.string(),
  weddingId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  stripePriceId: z.string().optional(), // Stripe price ID for the gift
  imageUrl: z.string().optional(), // Accept any string for imageUrl (can be S3 key or full URL)
  totalContributed: z.number().default(0), // Total amount contributed so far
  isFullyFunded: z.boolean().default(false), // Whether the gift is fully funded
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GiftRegistryType = z.infer<typeof schema>;
export type GiftContributionType = z.infer<typeof giftContributionSchema>; 