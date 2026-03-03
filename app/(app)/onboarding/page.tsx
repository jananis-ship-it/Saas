import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getWorkspacesForCurrentUser } from "@/actions/workspaces";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  if (user.onboardingCompletedAt) redirect("/dashboard");

  const workspaces = await getWorkspacesForCurrentUser();

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome to Taskflow
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first workspace or skip and do it later.
        </p>
      </div>
      <OnboardingForm hasWorkspaces={workspaces.length > 0} />
    </div>
  );
}
