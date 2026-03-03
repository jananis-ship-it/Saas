"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { SectionCard } from "@/components/app/SectionCard";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { toast } from "sonner";

export function DangerZone() {
  const { signOut } = useClerk();
  const [showSignOut, setShowSignOut] = useState(false);

  async function handleSignOut() {
    try {
      await signOut({ redirectUrl: "/" });
      toast.success("You have been signed out.");
    } catch {
      toast.error("Could not sign out.");
    }
  }

  return (
    <SectionCard
      title="Danger zone"
      description="Irreversible account actions."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-medium text-foreground">Sign out</p>
          <p className="text-sm text-muted-foreground">
            Sign out of your account on this device.
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="rounded-md shrink-0"
          onClick={() => setShowSignOut(true)}
        >
          Sign out
        </Button>
      </div>

      <ConfirmDialog
        open={showSignOut}
        onOpenChange={setShowSignOut}
        title="Sign out?"
        description="You will need to sign in again to access your account."
        confirmLabel="Sign out"
        variant="destructive"
        onConfirm={handleSignOut}
      />
    </SectionCard>
  );
}
