import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getWorkspacesForCurrentUser } from "@/actions/workspaces";
import { getWorkspaceById } from "@/lib/workspace";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const [workspaces, workspace] = await Promise.all([
    getWorkspacesForCurrentUser(),
    getWorkspaceById(workspaceId),
  ]);

  if (!workspace) notFound();

  const member = workspaces.find((w) => w.id === workspaceId);
  if (!member) notFound();

  return <>{children}</>;
}
