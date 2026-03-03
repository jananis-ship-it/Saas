import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import {
  Check,
  ChevronRight,
  FolderKanban,
  ListTodo,
  Users,
  Zap,
} from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Button asChild size="default" className="rounded-md">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Ship work together
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Track projects and tasks with your team. Simple, fast, and built
              for small teams that move quickly.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-md">
                <Link href="/sign-up">
                  Start free <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-md">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-muted/30 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-2xl font-semibold text-foreground">
              Everything you need to stay in sync
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
              Workspaces, projects, and tasks in one place.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: FolderKanban,
                  title: "Projects",
                  desc: "Organize work by project. Add descriptions and due dates.",
                },
                {
                  icon: ListTodo,
                  title: "Tasks",
                  desc: "Todo, In progress, Done. Simple statuses that scale.",
                },
                {
                  icon: Users,
                  title: "Workspaces",
                  desc: "Invite your team. One workspace per company or squad.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-lg border border-slate-200 bg-card p-6 shadow-sm dark:border-slate-700"
                >
                  <f.icon className="h-10 w-10 text-primary" aria-hidden />
                  <h3 className="mt-4 font-medium text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            Simple pricing
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Free for small teams. Upgrade when you need more.
          </p>
          <div className="mx-auto mt-10 max-w-md rounded-lg border border-slate-200 bg-card p-8 shadow-sm dark:border-slate-700">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Up to 5 members. Unlimited projects and tasks.
            </p>
            <ul className="mt-6 space-y-3">
              {["Unlimited projects", "Unlimited tasks", "Activity log", "Email support"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" aria-hidden />
                    {item}
                  </li>
                )
              )}
            </ul>
            <Button asChild className="mt-8 w-full rounded-md" size="lg">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-muted/30 dark:border-slate-800">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-center text-2xl font-semibold text-foreground">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-8">
              {[
                {
                  q: "How do workspaces work?",
                  a: "Create a workspace (e.g. your company name). Invite members with Admin or Member roles. All projects and tasks live inside a workspace.",
                },
                {
                  q: "Can I switch between workspaces?",
                  a: "Yes. Use the workspace switcher in the sidebar to change context. Your activity log is scoped per workspace.",
                },
                {
                  q: "Is my data private?",
                  a: "Yes. Data is isolated per workspace. Only members you invite can see projects and tasks.",
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <dt className="font-medium text-foreground">{faq.q}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-card p-10 shadow-sm dark:border-slate-700">
              <Zap className="h-12 w-12 text-primary" aria-hidden />
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                Ready to get started?
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Create your account and add your first workspace in under a minute.
              </p>
              <Button asChild className="mt-6 rounded-md" size="lg">
                <Link href="/sign-up">Create account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
