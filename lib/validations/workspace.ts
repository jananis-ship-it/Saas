import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50)
    .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
