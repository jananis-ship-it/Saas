import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { NewTaskForm } from "./NewTaskForm";

type Props = { params: Promise<{ workspaceId: string; id: string }> };

export default async function NewTaskPage({ params }: Props) {
  const { workspaceId, id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  await requireMembership(user.id, workspaceId);

  const project = await prisma.project.findFirst({
    where: { id, workspaceId },
  });

  if (!project) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title="New task"
        description={`Add a task to ${project.name}`}
        action={
          <Button variant="outline" asChild className="rounded-md">
            <Link href={`/w/${workspaceId}/projects/${id}`}>Cancel</Link>
          </Button>
        }
      />
      <NewTaskForm workspaceId={workspaceId} projectId={id} />
    </div>
  );
}
