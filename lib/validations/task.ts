import { z } from "zod";
import { TaskStatus } from "@/lib/types";

const taskStatusEnum = z.enum([TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Done]);

export const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(5000).optional(),
  status: taskStatusEnum.optional(),
  dueAt: z.string().optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional(),
  status: taskStatusEnum.optional(),
  dueAt: z.string().optional().nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
