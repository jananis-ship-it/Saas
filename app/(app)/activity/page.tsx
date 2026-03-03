import { getCurrentUser } from "@/lib/auth";
import { getActivityLogs } from "@/actions/activity";
import { PageHeader } from "@/components/app/PageHeader";
import { SectionCard } from "@/components/app/SectionCard";
import { ActivityList } from "./ActivityList";

type Props = {
  searchParams: Promise<{ workspaceId?: string; page?: string }>;
};

export default async function ActivityPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { workspaceId = null, page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(String(page), 10));
  const { logs, total, hasMore } = await getActivityLogs(workspaceId, pageNum);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity"
        description="Recent actions across your workspaces."
      />
      <SectionCard
        title="Activity log"
        description={total > 0 ? `${total} event(s)` : undefined}
      >
        <ActivityList logs={logs} hasMore={hasMore} page={pageNum} />
      </SectionCard>
    </div>
  );
}
