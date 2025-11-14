import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  age: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  email: z
    .string()
    .min(10, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  email: z
    .string()
    .min(10, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
});
