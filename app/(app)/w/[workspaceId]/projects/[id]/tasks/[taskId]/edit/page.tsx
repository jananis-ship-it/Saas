import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { EditTaskForm } from "./EditTaskForm";

type Props = {
  params: Promise<{ workspaceId: string; id: string; taskId: string }>;
};

export default async function EditTaskPage({ params }: Props) {
  const { workspaceId, id: projectId, taskId } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  await requireMembership(user.id, workspaceId);

  const task = await prisma.task.findFirst({
    where: { id: taskId, projectId },
    include: { project: true },
  });

  if (!task) notFound();

  const dueAt = task.dueAt
    ? new Date(task.dueAt).toISOString().slice(0, 16)
    : "";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit task"
        description={task.title}
        action={
          <Button variant="outline" asChild className="rounded-md">
            <Link href={`/w/${workspaceId}/projects/${projectId}`}>
              Back to project
            </Link>
          </Button>
        }
      />
      <EditTaskForm
        workspaceId={workspaceId}
        projectId={projectId}
        taskId={taskId}
        defaultValues={{
          title: task.title,
          description: task.description ?? "",
          status: task.status,
          dueAt,
        }}
      />
    </div>
  );
}
