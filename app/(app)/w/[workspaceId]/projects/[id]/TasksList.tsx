"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "@/components/app/StatusBadge";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { deleteTask } from "@/actions/tasks";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueAt: Date | null;
};

type Props = {
  workspaceId: string;
  projectId: string;
  tasks: Task[];
};

export function TasksList({ workspaceId, projectId, tasks }: Props) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const result = await deleteTask(id);
      if (result.success) {
        toast.success("Task deleted.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-muted-foreground dark:border-slate-700">
        No tasks yet.{" "}
        <Link
          href={`/w/${workspaceId}/projects/${projectId}/tasks/new`}
          className="font-medium text-primary hover:underline"
        >
          Add one
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={`/w/${workspaceId}/projects/${projectId}/tasks/${t.id}/edit`}
                className="font-medium text-foreground hover:underline"
              >
                {t.title}
              </Link>
              {t.description && (
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {t.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <TaskStatusBadge status={t.status} />
              {t.dueAt && (
                <span className="text-xs text-muted-foreground">
                  {new Date(t.dueAt).toLocaleDateString()}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md"
                asChild
              >
                <Link
                  href={`/w/${workspaceId}/projects/${projectId}/tasks/${t.id}/edit`}
                  aria-label={`Edit ${t.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-destructive hover:text-destructive"
                onClick={() => setDeleteId(t.id)}
                aria-label={`Delete ${t.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete task?"
        description="This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={loading}
        onConfirm={() => { if (deleteId) void handleDelete(deleteId); }}
      />
    </>
  );
}
