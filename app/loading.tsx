import { CardSkeleton } from "@/components/app/skeletons/CardSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8 p-4">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
