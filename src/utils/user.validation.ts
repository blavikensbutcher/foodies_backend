import { z } from "zod";

export const updateAvatarSchema = z.object({
  avatar: z
    .string()
    .trim()
    .min(1, "Avatar must not be empty")
    .max(2048, "Avatar must contain at most 2048 characters")
    .nullable(),
});

export const UserParamsSchema = z.object({
  id: z.string().trim().min(1, "User id is required"),
});

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
