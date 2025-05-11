import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  purchased: z.boolean().default(false),
  purchasedBy: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GiftRegistryType = z.infer<typeof schema>; 