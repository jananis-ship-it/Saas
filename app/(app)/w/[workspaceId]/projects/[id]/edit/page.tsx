import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { EditProjectForm } from "../../EditProjectForm";

type Props = { params: Promise<{ workspaceId: string; id: string }> };

export default async function EditProjectPage({ params }: Props) {
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
        title="Edit project"
        description={project.name}
        action={
          <Button variant="outline" asChild className="rounded-md">
            <Link href={`/w/${workspaceId}/projects/${id}`}>Cancel</Link>
          </Button>
        }
      />
      <EditProjectForm
        workspaceId={workspaceId}
        projectId={id}
        defaultValues={{
          name: project.name,
          description: project.description ?? "",
        }}
      />
    </div>
  );
}
