import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/app/SectionCard";
import { TaskStatusBadge } from "@/components/app/StatusBadge";
import { TasksList } from "./TasksList";

type Props = {
  params: Promise<{ workspaceId: string; id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { workspaceId, id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  await requireMembership(user.id, workspaceId);

  const project = await prisma.project.findFirst({
    where: { id, workspaceId },
    include: {
      tasks: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={project.name}
        description={project.description ?? undefined}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild className="rounded-md">
              <Link href={`/w/${workspaceId}/projects`}>Back to projects</Link>
            </Button>
            <Button asChild className="rounded-md">
              <Link href={`/w/${workspaceId}/projects/${id}/edit`}>Edit</Link>
            </Button>
          </div>
        }
      />
      <SectionCard
        title="Tasks"
        description={`${project.tasks.length} task(s)`}
        headerAction={
          <Button asChild size="sm" className="rounded-md">
            <Link href={`/w/${workspaceId}/projects/${id}/tasks/new`}>
              Add task
            </Link>
          </Button>
        }
      >
        <TasksList
          workspaceId={workspaceId}
          projectId={id}
          tasks={project.tasks}
        />
      </SectionCard>
    </div>
  );
}
