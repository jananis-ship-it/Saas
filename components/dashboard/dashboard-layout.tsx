"use client";

import Link from "next/link";

const navItems = [
  { label: "Overview", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Team", href: "#" },
  { label: "Settings", href: "#" },
];

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Dashboard
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-muted" />
            <span className="text-sm font-medium text-foreground">Account</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
