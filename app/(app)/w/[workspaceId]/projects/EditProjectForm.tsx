"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/app/forms/TextField";
import { TextAreaField } from "@/components/app/forms/TextAreaField";
import { SectionCard } from "@/components/app/SectionCard";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

type Props = {
  workspaceId: string;
  projectId: string;
  defaultValues: { name: string; description: string };
};

export function EditProjectForm({
  workspaceId,
  projectId,
  defaultValues,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: projectId,
      name: defaultValues.name,
      description: defaultValues.description,
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("id", data.id);
      fd.set("name", data.name);
      fd.set("description", data.description ?? "");
      const result = await updateProject(null, fd);
      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      toast.success("Project updated.");
      router.push(`/w/${workspaceId}/projects/${projectId}`);
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
            <TextField name="name" label="Name" required />
            <TextAreaField
              name="description"
              label="Description"
              rows={3}
            />
            <Button
              type="submit"
              disabled={loading}
              className="rounded-md"
              aria-busy={loading}
            >
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </SectionCard>
      </form>
    </FormProvider>
  );
}
