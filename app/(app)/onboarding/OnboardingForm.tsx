"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "@/lib/validations/workspace";
import { createWorkspace } from "@/actions/workspaces";
import { completeOnboarding } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/app/forms/TextField";
import { toast } from "sonner";

type Props = { hasWorkspaces: boolean };

export function OnboardingForm({ hasWorkspaces }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onboardingSchema = createWorkspaceSchema.extend({
    slug: createWorkspaceSchema.shape.slug.optional(),
  });
  type OnboardingFormValues = { name: string; slug?: string };
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const name = form.watch("name");
  const slugFromName =
    name &&
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  async function onSubmit(data: OnboardingFormValues) {
    setLoading(true);
    try {
      const slug =
        (data.slug && data.slug.trim()) || slugFromName || data.name.toLowerCase().replace(/\s+/g, "-");
      const fd = new FormData();
      fd.set("name", data.name);
      fd.set("slug", slug);
      const result = await createWorkspace(null, fd);
      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      await completeOnboarding();
      toast.success("Workspace created.");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleSkip() {
    setLoading(true);
    try {
      await completeOnboarding();
      toast.success("You can create a workspace later.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
    <div className="space-y-6">
      <form
        onSubmit={form.handleSubmit((d) =>
          onSubmit({ ...d, slug: d.slug || slugFromName || "" })
        )}
        className="space-y-4"
      >
        <TextField
          name="name"
          label="Workspace name"
          placeholder="Acme Inc"
          required
        />
        <TextField
          name="slug"
          label="URL slug"
          placeholder={slugFromName || "acme-inc"}
          description="Used in URLs. Leave blank to derive from name."
        />
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="rounded-md"
            aria-busy={loading}
          >
            {loading ? "Creating…" : "Create workspace"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={loading}
            className="rounded-md"
          >
            Skip for now
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        You can add more workspaces later from the dashboard.
      </p>
    </div>
    </FormProvider>
  );
}
