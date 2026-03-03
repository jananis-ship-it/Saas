"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        We’ve recorded the error. Try again or go back.
      </p>
      <Button onClick={reset} className="rounded-md">
        Try again
      </Button>
    </div>
  );
}
