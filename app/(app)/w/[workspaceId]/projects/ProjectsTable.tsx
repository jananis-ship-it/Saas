"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { bulkDeleteProjects } from "@/actions/projects";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string | null;
  _count: { tasks: number };
};

type Props = {
  workspaceId: string;
  projects: Project[];
  page: number;
  totalPages: number;
  total: number;
  searchQuery: string;
  sort: string;
};

export function ProjectsTable({
  workspaceId,
  projects,
  page,
  totalPages,
  total,
  searchQuery,
  sort,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string | null;
    bulk: string[];
  }>({ open: false, id: null, bulk: [] });
  const [loading, setLoading] = useState(false);

  const base = `/w/${workspaceId}/projects`;
  const searchParams = new URLSearchParams();
  if (searchQuery) searchParams.set("q", searchQuery);
  if (sort !== "updatedAt") searchParams.set("sort", sort);
  const queryString = searchParams.toString();

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === projects.length) setSelected(new Set());
    else setSelected(new Set(projects.map((p) => p.id)));
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const { deleteProject } = await import("@/actions/projects");
      const result = await deleteProject(id);
      if (result.success) {
        toast.success("Project deleted.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
      setDeleteConfirm((c) => ({ ...c, open: false, id: null }));
    }
  }

  async function handleBulkDelete(ids: string[]) {
    setLoading(true);
    try {
      const result = await bulkDeleteProjects(ids);
      if (result.success) {
        toast.success("Projects deleted.");
        setSelected(new Set());
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
      setDeleteConfirm((c) => ({ ...c, open: false, bulk: [] }));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search projects…"
            defaultValue={searchQuery}
            className="max-w-xs rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = (e.target as HTMLInputElement).value;
                const u = new URL(base, "http://x");
                if (v) u.searchParams.set("q", v);
                if (sort !== "updatedAt") u.searchParams.set("sort", sort);
                router.push(u.pathname + u.search);
              }
            }}
          />
          <Select
            value={sort}
            onValueChange={(v) => {
              const u = new URL(base, "http://x");
              if (searchQuery) u.searchParams.set("q", searchQuery);
              if (v !== "updatedAt") u.searchParams.set("sort", v);
              router.push(u.pathname + u.search);
            }}
          >
            <SelectTrigger className="w-[140px] rounded-md">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selected.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="rounded-md"
            onClick={() =>
              setDeleteConfirm({ open: true, id: null, bulk: Array.from(selected) })
            }
          >
            Delete {selected.size} selected
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-slate-200 bg-muted/50 dark:border-slate-700">
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={projects.length > 0 && selected.size === projects.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all"
                  className="rounded-md"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                Tasks
              </th>
              <th className="w-24 px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    aria-label={`Select ${p.name}`}
                    className="rounded-md"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/w/${workspaceId}/projects/${p.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {p.name}
                  </Link>
                  {p.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {p.description}
                    </p>
                  )}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{p._count.tasks}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                      asChild
                    >
                      <Link href={`/w/${workspaceId}/projects/${p.id}/edit`} aria-label={`Edit ${p.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md text-destructive hover:text-destructive"
                      onClick={() =>
                        setDeleteConfirm({ open: true, id: p.id, bulk: [] })
                      }
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-md"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link
                  href={
                    base +
                    (page > 2
                      ? `?page=${page - 1}${queryString ? `&${queryString}` : ""}`
                      : queryString ? `?${queryString}` : "")
                  }
                >
                  Previous
                </Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-md"
              disabled={page >= totalPages}
              asChild={page < totalPages}
            >
              {page < totalPages ? (
                <Link
                  href={
                    base +
                    `?page=${page + 1}${queryString ? `&${queryString}` : ""}`
                  }
                >
                  Next
                </Link>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) =>
          !open && setDeleteConfirm({ open: false, id: null, bulk: [] })
        }
        title={deleteConfirm.bulk.length ? "Delete selected projects?" : "Delete project?"}
        description={
          deleteConfirm.bulk.length
            ? `This will delete ${deleteConfirm.bulk.length} project(s) and all their tasks. This cannot be undone.`
            : "This will delete the project and all its tasks. This cannot be undone."
        }
        confirmLabel="Delete"
        variant="destructive"
        loading={loading}
        onConfirm={() =>
          deleteConfirm.bulk.length
            ? handleBulkDelete(deleteConfirm.bulk)
            : deleteConfirm.id
              ? handleDelete(deleteConfirm.id)
              : undefined
        }
      />
    </div>
  );
}
