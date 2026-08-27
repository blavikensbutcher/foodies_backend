import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(50, "Name must contain at most 50 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password must contain at most 128 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .transform((value) => value.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password must contain at most 128 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;