import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  age: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
