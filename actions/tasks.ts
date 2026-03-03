"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";
import { logActivity } from "@/lib/activity";
import { TaskStatus, MembershipRole } from "@/lib/types";

export type TaskActionResult =
  | { success: true; data?: { id: string } }
  | { success: false; error: string; code?: "FORBIDDEN" | "NOT_FOUND" };

function parseDueAt(value: string | undefined): Date | null {
  if (!value || value === "") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function createTask(
  _prev: unknown,
  formData: FormData
): Promise<TaskActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = createTaskSchema.safeParse({
    projectId: raw.projectId,
    title: raw.title,
    description: raw.description || undefined,
    status: raw.status || undefined,
    dueAt: raw.dueAt || undefined,
  });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    return { success: false, error: Object.values(err).flat().join(" ") || "Validation failed" };
  }

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: { workspaceId: true },
  });
  if (!project) return { success: false, error: "Project not found", code: "NOT_FOUND" };

  try {
    await requireMembership(user.id, project.workspaceId, [
      MembershipRole.Owner,
      MembershipRole.Admin,
      MembershipRole.Member,
    ]);
  } catch {
    return { success: false, error: "Forbidden", code: "FORBIDDEN" };
  }

  const task = await prisma.task.create({
    data: {
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      status: (parsed.data.status as string) ?? TaskStatus.Todo,
      dueAt: parseDueAt(parsed.data.dueAt),
    },
  });

  await logActivity({
    userId: user.id,
    workspaceId: project.workspaceId,
    action: "task.create",
    entityType: "Task",
    entityId: task.id,
    metadata: { title: task.title, projectId: project.workspaceId },
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
  revalidatePath("/dashboard");
  return { success: true, data: { id: task.id } };
}

export async function updateTask(
  _prev: unknown,
  formData: FormData
): Promise<TaskActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateTaskSchema.safeParse({
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    dueAt: raw.dueAt === "" || raw.dueAt === "null" ? null : raw.dueAt,
  });
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const existing = await prisma.task.findUnique({
    where: { id: parsed.data.id },
    include: { project: true },
  });
  if (!existing) return { success: false, error: "Task not found", code: "NOT_FOUND" };

  try {
    await requireMembership(user.id, existing.project.workspaceId, [
      MembershipRole.Owner,
      MembershipRole.Admin,
      MembershipRole.Member,
    ]);
  } catch {
    return { success: false, error: "Forbidden", code: "FORBIDDEN" };
  }

  const updateData: { title?: string; description?: string | null; status?: string; dueAt?: Date | null } = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description ?? null;
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status as string;
  if (parsed.data.dueAt !== undefined) updateData.dueAt = parseDueAt(parsed.data.dueAt as string);

  await prisma.task.update({
    where: { id: parsed.data.id },
    data: updateData,
  });

  await logActivity({
    userId: user.id,
    workspaceId: existing.project.workspaceId,
    action: "task.update",
    entityType: "Task",
    entityId: existing.id,
  });

  revalidatePath(`/projects/${existing.projectId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTask(taskId: string): Promise<TaskActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) return { success: false, error: "Task not found", code: "NOT_FOUND" };

  try {
    await requireMembership(user.id, task.project.workspaceId, [
      MembershipRole.Owner,
      MembershipRole.Admin,
      MembershipRole.Member,
    ]);
  } catch {
    return { success: false, error: "Forbidden", code: "FORBIDDEN" };
  }

  await prisma.task.delete({ where: { id: taskId } });

  await logActivity({
    userId: user.id,
    workspaceId: task.project.workspaceId,
    action: "task.delete",
    entityType: "Task",
    entityId: task.id,
  });

  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function bulkDeleteTasks(taskIds: string[]): Promise<TaskActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const tasks = await prisma.task.findMany({
    where: { id: { in: taskIds } },
    include: { project: true },
  });

  for (const t of tasks) {
    try {
      await requireMembership(user.id, t.project.workspaceId, [
        MembershipRole.Owner,
        MembershipRole.Admin,
        MembershipRole.Member,
      ]);
    } catch {
      return { success: false, error: "You don't have permission for one or more tasks", code: "FORBIDDEN" };
    }
  }

  await prisma.task.deleteMany({ where: { id: { in: taskIds } } });
  for (const t of tasks) {
    await logActivity({
      userId: user.id,
      workspaceId: t.project.workspaceId,
      action: "task.delete",
      entityType: "Task",
      entityId: t.id,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  return { success: true };
}
