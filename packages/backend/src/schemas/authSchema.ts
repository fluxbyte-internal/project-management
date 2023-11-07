import { z } from "zod";

export const authSignUpSchema = z.object({
  email: z.string().email({ message: 'Email is not valid' }),
  password: z.string()
});

export const authLoginSchema = z.object({
  email: z.string().email({ message: 'Email is not valid' }),
  password: z.string()
});

export const authRefreshTokenSchema = z.string();