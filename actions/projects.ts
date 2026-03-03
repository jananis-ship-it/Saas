"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations/project";
import { logActivity } from "@/lib/activity";
import { MembershipRole } from "@/lib/types";

export type ProjectActionResult =
  | { success: true; data?: { id: string } }
  | { success: false; error: string; code?: "CONFLICT" | "FORBIDDEN" | "NOT_FOUND" };

export async function createProject(
  _prev: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = createProjectSchema.safeParse({
    workspaceId: raw.workspaceId,
    name: raw.name,
    description: raw.description || undefined,
  });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    return { success: false, error: Object.values(err).flat().join(" ") || "Validation failed" };
  }

  try {
    await requireMembership(user.id, parsed.data.workspaceId, [
      MembershipRole.Owner,
      MembershipRole.Admin,
      MembershipRole.Member,
    ]);
  } catch {
    return { success: false, error: "You don't have access to this workspace", code: "FORBIDDEN" };
  }

  const project = await prisma.project.create({
    data: {
      workspaceId: parsed.data.workspaceId,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    },
  });

  await logActivity({
    userId: user.id,
    workspaceId: project.workspaceId,
    action: "project.create",
    entityType: "Project",
    entityId: project.id,
    metadata: { name: project.name },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/workspace/${parsed.data.workspaceId}`);
  revalidatePath(`/projects`);
  return { success: true, data: { id: project.id } };
}

export async function updateProject(
  _prev: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateProjectSchema.safeParse({
    id: raw.id,
    name: raw.name,
    description: raw.description,
  });
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const existing = await prisma.project.findUnique({
    where: { id: parsed.data.id },
    select: { workspaceId: true, updatedAt: true },
  });
  if (!existing) return { success: false, error: "Project not found", code: "NOT_FOUND" };

  try {
    await requireMembership(user.id, existing.workspaceId, [
      MembershipRole.Owner,
      MembershipRole.Admin,
      MembershipRole.Member,
    ]);
  } catch {
    return { success: false, error: "Forbidden", code: "FORBIDDEN" };
  }

  const updated = await prisma.project.update({
    where: { id: parsed.data.id },
    data: {
      ...(parsed.data.name !== undefined && { name: parsed.data.name }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description ?? null }),
    },
  });

  await logActivity({
    userId: user.id,
    workspaceId: updated.workspaceId,
    action: "project.update",
    entityType: "Project",
    entityId: updated.id,
    metadata: { name: updated.name },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/workspace/${existing.workspaceId}`);
  revalidatePath(`/projects`);
  revalidatePath(`/projects/${parsed.data.id}`);
  return { success: true, data: { id: updated.id } };
}

export async function deleteProject(projectId: string): Promise<ProjectActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, workspaceId: true, name: true },
  });
  if (!project) return { success: false, error: "Project not found", code: "NOT_FOUND" };

  try {
    await requireMembership(user.id, project.workspaceId, [
      MembershipRole.Owner,
      MembershipRole.Admin,
    ]);
  } catch {
    return { success: false, error: "Only admins can delete projects", code: "FORBIDDEN" };
  }

  await prisma.project.delete({ where: { id: projectId } });

  await logActivity({
    userId: user.id,
    workspaceId: project.workspaceId,
    action: "project.delete",
    entityType: "Project",
    entityId: project.id,
    metadata: { name: project.name },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/workspace/${project.workspaceId}`);
  revalidatePath("/projects");
  return { success: true };
}

export async function bulkDeleteProjects(
  projectIds: string[]
): Promise<ProjectActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "FORBIDDEN" };

  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, workspaceId: true },
  });

  for (const p of projects) {
    try {
      await requireMembership(user.id, p.workspaceId, [
        MembershipRole.Owner,
        MembershipRole.Admin,
      ]);
    } catch {
      return { success: false, error: "You don't have permission to delete one or more projects", code: "FORBIDDEN" };
    }
  }

  await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
  for (const p of projects) {
    await logActivity({
      userId: user.id,
      workspaceId: p.workspaceId,
      action: "project.delete",
      entityType: "Project",
      entityId: p.id,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  return { success: true };
}
