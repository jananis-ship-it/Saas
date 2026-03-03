import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  children,
  className,
  headerAction,
}: SectionCardProps) {
  return (
    <Card
      className={cn(
        "rounded-lg border border-slate-200 shadow-sm dark:border-slate-700",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription className="mt-1 text-sm">{description}</CardDescription>
          )}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
