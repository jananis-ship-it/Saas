import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { requireMembership } from "@/lib/workspace";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/app/PageHeader";
import { SectionCard } from "@/components/app/SectionCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/app/EmptyState";
import { ProjectsTable } from "./ProjectsTable";
import { TableSkeleton } from "@/components/app/skeletons/TableSkeleton";
import { FolderKanban } from "lucide-react";
import { PAGINATION_DEFAULT } from "@/lib/constants";

type PageProps = {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ q?: string; status?: string; sort?: string; page?: string }>;
};

export default async function ProjectsPage({ params, searchParams }: PageProps) {
  const { workspaceId } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  await requireMembership(user.id, workspaceId);

  const { q = "", sort = "updatedAt", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(String(page), 10));
  const skip = (pageNum - 1) * PAGINATION_DEFAULT;

  const where = {
    workspaceId,
    ...(q.trim() && {
      OR: [
        { name: { contains: q.trim() } },
        { description: { contains: q.trim() } },
      ],
    }),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: sort === "name" ? { name: "asc" } : { updatedAt: "desc" },
      skip,
      take: PAGINATION_DEFAULT + 1,
      include: { _count: { select: { tasks: true } } },
    }),
    prisma.project.count({ where }),
  ]);

  const hasMore = projects.length > PAGINATION_DEFAULT;
  const items = hasMore ? projects.slice(0, PAGINATION_DEFAULT) : projects;
  const totalPages = Math.ceil(total / PAGINATION_DEFAULT);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Manage projects in this workspace."
        action={
          <Button asChild className="rounded-md">
            <Link href={`/w/${workspaceId}/projects/new`}>New project</Link>
          </Button>
        }
      />
      <SectionCard
        title="All projects"
        description={total > 0 ? `${total} project${total === 1 ? "" : "s"}` : undefined}
      >
        <Suspense fallback={<TableSkeleton rows={5} cols={3} />}>
          {items.length === 0 ? (
            <EmptyState
              icon={<FolderKanban className="h-6 w-6" />}
              title="No projects yet"
              description="Create your first project to add tasks."
              action={{
                label: "New project",
                href: `/w/${workspaceId}/projects/new`,
              }}
            />
          ) : (
            <ProjectsTable
              workspaceId={workspaceId}
              projects={items}
              page={pageNum}
              totalPages={totalPages}
              total={total}
              searchQuery={q}
              sort={sort}
            />
          )}
        </Suspense>
      </SectionCard>
    </div>
  );
}
