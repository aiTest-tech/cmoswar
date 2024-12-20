// src/features/registerApi.ts
import { z } from "zod";

export interface LoginType {
  email: string;
  password: string;
}

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
