import { z } from "zod";

export const schema = z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });

  export type UserType = z.infer<typeof schema>;