import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";

type Workspace = { id: string; name: string; slug: string };

type AppShellProps = {
  children: React.ReactNode;
  workspaceId: string | null;
  workspaces: Workspace[];
};

export function AppShell({ children, workspaceId, workspaces }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar workspaceId={workspaceId} workspaces={workspaces} />
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          role="main"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
