import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-xl font-semibold text-foreground">404</h1>
      <p className="text-sm text-muted-foreground">This page could not be found.</p>
      <Button asChild className="rounded-md">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
