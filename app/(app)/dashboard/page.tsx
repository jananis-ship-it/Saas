import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getWorkspacesForCurrentUser } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { FolderKanban } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  if (!user.onboardingCompletedAt) redirect("/onboarding");

  const workspaces = await getWorkspacesForCurrentUser();
  if (workspaces.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Create a workspace to get started."
        />
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title="No workspace yet"
          description="Create your first workspace to add projects and tasks."
          action={{ label: "Go to onboarding", href: "/onboarding" }}
        />
      </div>
    );
  }

  redirect(`/w/${workspaces[0].id}/projects`);
}
