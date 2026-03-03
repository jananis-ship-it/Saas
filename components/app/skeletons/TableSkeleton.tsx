import { cn } from "@/lib/utils";

export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-lg border border-slate-200 bg-card p-4 dark:border-slate-700"
          >
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className="h-5 flex-1 rounded bg-muted"
                style={{ width: j === 0 ? "40%" : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
