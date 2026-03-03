import { z } from "zod";

export const createProjectSchema = z.object({
  workspaceId: z.string().min(1, "Workspace is required"),
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
