import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg border border-slate-200 bg-card p-6 dark:border-slate-700",
        className
      )}
    >
      <div className="h-5 w-1/3 rounded bg-muted" />
      <div className="mt-4 h-4 w-full rounded bg-muted" />
      <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
    </div>
  );
}
