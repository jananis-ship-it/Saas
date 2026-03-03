import { prisma } from "@/lib/db";
import type { MembershipRole } from "@/lib/types";

export async function getMembership(
  userId: string,
  workspaceId: string
): Promise<{ role: string } | null> {
  const m = await prisma.membership.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
    select: { role: true },
  });
  return m;
}

export async function requireMembership(
  userId: string,
  workspaceId: string,
  allowedRoles?: MembershipRole[]
): Promise<{ role: string }> {
  const m = await getMembership(userId, workspaceId);
  if (!m) throw new Error("Forbidden");
  if (allowedRoles && !allowedRoles.includes(m.role as MembershipRole))
    throw new Error("Forbidden");
  return m;
}

export async function getWorkspacesForUser(userId: string) {
  return prisma.workspace.findMany({
    where: { memberships: { some: { userId } } },
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getWorkspaceById(workspaceId: string) {
  return prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
}
