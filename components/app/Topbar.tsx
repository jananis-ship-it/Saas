"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/app/ThemeToggle";

export function Topbar() {
  return (
    <header
      className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-slate-800"
      role="banner"
    >
      <div className="flex items-center gap-4" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 rounded-md",
            },
          }}
        />
      </div>
    </header>
  );
}
