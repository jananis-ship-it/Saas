"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/app/forms/TextField";
import { toast } from "sonner";
import { useState } from "react";

type Props = { defaultName: string };

export function ProfileForm({ defaultName }: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: defaultName },
  });

  async function onSubmit(data: ProfileInput) {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("name", data.name);
      const result = await updateProfile(null, fd);
      if (result.success) {
        toast.success("Profile updated.");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextField name="name" label="Display name" required />
        <Button
          type="submit"
          disabled={loading}
          className="rounded-md"
          aria-busy={loading}
        >
          {loading ? "Saving…" : "Save"}
        </Button>
      </form>
    </FormProvider>
  );
}
