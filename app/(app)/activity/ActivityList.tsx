"use client";

import Link from "next/link";

type Log = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

type Props = {
  logs: Log[];
  hasMore: boolean;
  page: number;
};

function formatAction(action: string): string {
  return action
    .split(".")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function ActivityList({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
      {logs.map((log) => (
        <li key={log.id} className="py-3 first:pt-0">
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">
              {formatAction(log.action)} {log.entityType}
            </span>
            {log.metadata && typeof log.metadata.name === "string" && (
              <span className="text-muted-foreground">{log.metadata.name}</span>
            )}
            <time
              dateTime={new Date(log.createdAt).toISOString()}
              className="text-xs text-muted-foreground"
            >
              {new Date(log.createdAt).toLocaleString()}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
