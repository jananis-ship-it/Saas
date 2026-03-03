import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { NewProjectForm } from "../NewProjectForm";

type Props = { params: Promise<{ workspaceId: string }> };

export default async function NewProjectPage({ params }: Props) {
  const { workspaceId } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  await requireMembership(user.id, workspaceId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="New project"
        description="Add a project to this workspace."
        action={
          <Button variant="outline" asChild className="rounded-md">
            <Link href={`/w/${workspaceId}/projects`}>Cancel</Link>
          </Button>
        }
      />
      <NewProjectForm workspaceId={workspaceId} />
    </div>
  );
}
