"use server";

import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { MembershipRole } from "@/lib/types";

const PAGE_SIZE = 20;

export async function getActivityLogs(workspaceId: string | null, page: number = 1) {
  const user = await getCurrentUser();
  if (!user) return { logs: [], total: 0, hasMore: false };

  if (workspaceId) {
    await requireMembership(user.id, workspaceId, [
      MembershipRole.Owner,
      MembershipRole.Admin,
      MembershipRole.Member,
    ]);
  }

  const where = workspaceId
    ? { userId: user.id, workspaceId }
    : { userId: user.id };

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE + 1,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        metadata: true,
        createdAt: true,
      },
    }),
    prisma.activityLog.count({ where }),
  ]);

  const hasMore = logs.length > PAGE_SIZE;
  const items = hasMore ? logs.slice(0, PAGE_SIZE) : logs;

  return {
    logs: items.map((l) => ({
      ...l,
      metadata: l.metadata ? (JSON.parse(l.metadata) as Record<string, unknown>) : null,
    })),
    total,
    hasMore,
  };
}
