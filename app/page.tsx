import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Active projects",
    value: "12",
    change: "+2 this week",
    changePositive: true,
  },
  {
    label: "Team members",
    value: "24",
    change: "No change",
    changePositive: true,
  },
  {
    label: "Completion rate",
    value: "94%",
    change: "+4% from last month",
    changePositive: true,
  },
];

const recent = [
  { title: "Design system v2", meta: "Updated 2 hours ago" },
  { title: "Q1 roadmap review", meta: "Updated yesterday" },
  { title: "Onboarding flow", meta: "Updated 3 days ago" },
];

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-16">
        {/* Page header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            Overview
          </h1>
          <p className="text-base text-muted-foreground lg:text-lg">
            Welcome back. Here’s what’s happening with your workspace.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-card shadow-soft ring-0 transition-shadow hover:shadow-soft-lg"
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardDescription>
                <CardTitle className="mt-2 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                  {stat.value}
                </CardTitle>
                <p
                  className={
                    stat.changePositive
                      ? "text-sm text-muted-foreground"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {stat.change}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="rounded-2xl border-border/60 bg-card shadow-soft transition-shadow hover:shadow-soft-lg lg:col-span-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Recent activity
              </CardTitle>
              <CardDescription>
                Latest updates across your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border/50">
                {recent.map((item) => (
                  <li
                    key={item.title}
                    className="group flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.meta}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      View →
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card shadow-soft ring-0 transition-shadow hover:shadow-soft-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Quick actions
              </CardTitle>
              <CardDescription>
                Shortcuts to get things done
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                variant="default"
                className="w-full justify-center rounded-xl bg-primary py-6 text-sm font-medium transition-opacity hover:opacity-90"
              >
                New project
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center rounded-xl border-border/60 py-6 text-sm font-medium transition-colors hover:bg-muted/80 hover:border-border"
              >
                Invite team member
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-center rounded-xl py-6 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                View all projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
