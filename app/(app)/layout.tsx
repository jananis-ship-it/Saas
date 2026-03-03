import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getWorkspacesForCurrentUser } from "@/actions/workspaces";
import { AppShell } from "@/components/app/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkspacesForCurrentUser();
  const workspaceList = workspaces.map((w) => ({
    id: w.id,
    name: w.name,
    slug: w.slug,
  }));

  return (
    <AppShell
      workspaceId={null}
      workspaces={workspaceList}
    >
      {children}
    </AppShell>
  );
}
