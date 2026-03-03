"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TaskStatus } from "@/lib/types";
import { updateTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/app/forms/TextField";
import { TextAreaField } from "@/components/app/forms/TextAreaField";
import { SelectField } from "@/components/app/forms/SelectField";
import { SectionCard } from "@/components/app/SectionCard";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  status: z.enum([TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Done]),
  dueAt: z.string().optional(),
});

const statusOptions = [
  { value: TaskStatus.Todo, label: "To do" },
  { value: TaskStatus.InProgress, label: "In progress" },
  { value: TaskStatus.Done, label: "Done" },
];

type Props = {
  workspaceId: string;
  projectId: string;
  taskId: string;
  defaultValues: {
    title: string;
    description: string;
    status: string;
    dueAt: string;
  };
};

export function EditTaskForm({
  workspaceId,
  projectId,
  taskId,
  defaultValues,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues.title,
      description: defaultValues.description,
      status: defaultValues.status as z.infer<typeof schema>["status"],
      dueAt: defaultValues.dueAt,
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("id", taskId);
      fd.set("title", data.title);
      fd.set("description", data.description ?? "");
      fd.set("status", data.status);
      fd.set("dueAt", data.dueAt ?? "");
      const result = await updateTask(null, fd);
      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      toast.success("Task updated.");
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
            <TextField name="title" label="Title" required />
            <TextAreaField name="description" label="Description" rows={3} />
            <SelectField
              name="status"
              label="Status"
              options={statusOptions}
            />
            <TextField
              name="dueAt"
              label="Due date"
              type="datetime-local"
              description="Optional"
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
