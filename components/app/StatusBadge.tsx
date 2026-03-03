import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

// Allow string for DB-backed status

const statusConfig: Record<
  TaskStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  Todo: { label: "To do", variant: "secondary" },
  InProgress: { label: "In progress", variant: "default" },
  Done: { label: "Done", variant: "outline" },
};

export function TaskStatusBadge({
  status,
  className,
}: {
  status: TaskStatus | string;
  className?: string;
}) {
  const config = statusConfig[status as TaskStatus] ?? {
    label: status,
    variant: "outline" as const,
  };
  return (
    <Badge
      variant={config.variant}
      className={cn("rounded-md font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}
