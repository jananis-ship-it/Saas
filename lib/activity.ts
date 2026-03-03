import { prisma } from "@/lib/db";

type LogAction =
  | "project.create"
  | "project.update"
  | "project.delete"
  | "task.create"
  | "task.update"
  | "task.delete"
  | "workspace.create"
  | "support.create";

export async function logActivity(params: {
  userId: string;
  workspaceId?: string | null;
  action: LogAction;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await prisma.activityLog.create({
    data: {
      userId: params.userId,
      workspaceId: params.workspaceId ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    },
  });
}
