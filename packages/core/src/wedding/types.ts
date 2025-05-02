import { z } from "zod";

export const schema = z.object({
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
    updatedAt: z.string().optional()
});

export type WeddingType = z.infer<typeof schema>;