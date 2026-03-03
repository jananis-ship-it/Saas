"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { createWorkspaceSchema } from "@/lib/validations/workspace";
import { logActivity } from "@/lib/activity";
import { MembershipRole } from "@/lib/types";

export type WorkspaceActionResult =
  | { success: true; data?: unknown }
  | { success: false; error: string };

export async function createWorkspace(
  _prev: unknown,
  formData: FormData
): Promise<WorkspaceActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const name = typeof raw.name === "string" ? raw.name : "";
  const slugRaw = typeof raw.slug === "string" ? raw.slug : "";
  const parsed = createWorkspaceSchema.safeParse({
    name: name,
    slug: slugRaw ? slugRaw.toLowerCase().replace(/\s+/g, "-") : name.toLowerCase().replace(/\s+/g, "-"),
  });
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat().join(" ") || "Validation failed";
    return { success: false, error: msg };
  }

  const slug = parsed.data.slug;
  const existing = await prisma.workspace.findUnique({ where: { slug } });
  if (existing) return { success: false, error: "Workspace slug already taken" };

  const workspace = await prisma.$transaction(async (tx) => {
    const w = await tx.workspace.create({
      data: { name: parsed.data.name, slug },
    });
    await tx.membership.create({
      data: { workspaceId: w.id, userId: user.id, role: MembershipRole.Owner },
    });
    return w;
  });

  await logActivity({
    userId: user.id,
    workspaceId: workspace.id,
    action: "workspace.create",
    entityType: "Workspace",
    entityId: workspace.id,
    metadata: { name: workspace.name },
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return { success: true, data: { id: workspace.id, slug: workspace.slug } };
}

export async function getWorkspacesForCurrentUser() {
  const user = await getCurrentUser();
  if (!user) return [];
  const { getWorkspacesForUser } = await import("@/lib/workspace");
  return getWorkspacesForUser(user.id);
}

export async function switchWorkspaceAllowed(
  workspaceId: string
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  const { getMembership } = await import("@/lib/workspace");
  const m = await getMembership(user.id, workspaceId);
  return !!m;
}
