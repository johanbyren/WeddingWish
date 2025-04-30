import { z } from "zod";

export const userSubject = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type UserSubject = z.infer<typeof userSubject>;

export const subjects = {
  user: userSubject,
}; 