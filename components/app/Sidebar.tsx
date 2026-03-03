"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function getWorkspaceIdFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/w\/([^/]+)/);
  return m ? m[1] : null;
}
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Activity,
  Settings,
  HelpCircle,
} from "lucide-react";

type Workspace = { id: string; name: string; slug: string };

type SidebarProps = {
  workspaceId: string | null;
  workspaces: Workspace[];
};

const navItems = (workspaceId: string | null) => {
  const base = workspaceId ? `/w/${workspaceId}` : "";
  return [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: base ? `${base}/projects` : "/dashboard", label: "Projects", icon: FolderKanban },
    { href: base ? `${base}/tasks` : "/dashboard", label: "Tasks", icon: ListTodo },
    { href: "/activity", label: "Activity", icon: Activity },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help", icon: HelpCircle },
  ];
};

export function Sidebar({ workspaceId: propWorkspaceId, workspaces }: SidebarProps) {
  const pathname = usePathname();
  const workspaceId = propWorkspaceId ?? getWorkspaceIdFromPath(pathname);

  return (
    <aside
      className="flex h-full w-56 flex-col border-r border-slate-200 bg-sidebar dark:border-slate-800 dark:bg-sidebar"
      aria-label="Main navigation"
    >
      <div className="flex flex-col gap-6 p-4">
        {workspaces.length > 0 && (
          <div className="space-y-2">
            <p className="px-2 text-xs font-medium text-muted-foreground">
              Workspace
            </p>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={workspaceId ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                if (id) window.location.href = `/w/${id}/projects`;
              }}
              aria-label="Switch workspace"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <nav className="flex flex-col gap-1">
          {navItems(workspaceId).map((item) => {
            const href = item.href;
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
