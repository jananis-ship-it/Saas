"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations/project";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/app/forms/TextField";
import { TextAreaField } from "@/components/app/forms/TextAreaField";
import { SectionCard } from "@/components/app/SectionCard";
import { toast } from "sonner";
import { useState } from "react";

type Props = { workspaceId: string };

export function NewProjectForm({ workspaceId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      workspaceId,
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: CreateProjectInput) {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("workspaceId", data.workspaceId);
      fd.set("name", data.name);
      if (data.description) fd.set("description", data.description);
      const result = await createProject(null, fd);
      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      toast.success("Project created.");
      router.push(`/w/${workspaceId}/projects/${result.data!.id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SectionCard title="Details">
          <div className="space-y-4">
            <input type="hidden" {...form.register("workspaceId")} />
            <TextField name="name" label="Name" placeholder="Q1 Launch" required />
            <TextAreaField
              name="description"
              label="Description"
              placeholder="Optional description"
              rows={3}
            />
            <Button
              type="submit"
              disabled={loading}
              className="rounded-md"
              aria-busy={loading}
            >
              {loading ? "Creating…" : "Create project"}
            </Button>
          </div>
        </SectionCard>
      </form>
    </FormProvider>
  );
}
