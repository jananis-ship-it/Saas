"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskInput } from "@/lib/validations/task";
import { createTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/app/forms/TextField";
import { TextAreaField } from "@/components/app/forms/TextAreaField";
import { SelectField } from "@/components/app/forms/SelectField";
import { SectionCard } from "@/components/app/SectionCard";
import { toast } from "sonner";
import { useState } from "react";
import { TaskStatus } from "@/lib/types";

const statusOptions = [
  { value: TaskStatus.Todo, label: "To do" },
  { value: TaskStatus.InProgress, label: "In progress" },
  { value: TaskStatus.Done, label: "Done" },
];

type Props = { workspaceId: string; projectId: string };

export function NewTaskForm({ workspaceId, projectId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId,
      title: "",
      description: "",
      status: TaskStatus.Todo,
    },
  });

  async function onSubmit(data: CreateTaskInput) {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("projectId", data.projectId);
      fd.set("title", data.title);
      if (data.description) fd.set("description", data.description);
      if (data.status) fd.set("status", data.status);
      if (data.dueAt) fd.set("dueAt", data.dueAt);
      const result = await createTask(null, fd);
      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      toast.success("Task created.");
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
            <input type="hidden" {...form.register("projectId")} />
            <TextField name="title" label="Title" placeholder="Implement login" required />
            <TextAreaField name="description" label="Description" rows={3} />
            <SelectField
              name="status"
              label="Status"
              options={statusOptions}
              placeholder="Select status"
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
              {loading ? "Creating…" : "Create task"}
            </Button>
          </div>
        </SectionCard>
      </form>
    </FormProvider>
  );
}
