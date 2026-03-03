"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportRequestSchema, type SupportRequestInput } from "@/lib/validations/support";
import { submitSupportRequest } from "@/actions/support";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/app/forms/TextField";
import { TextAreaField } from "@/components/app/forms/TextAreaField";
import { toast } from "sonner";
import { useState } from "react";

export function SupportForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<SupportRequestInput>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: { subject: "", message: "" },
  });

  async function onSubmit(data: SupportRequestInput) {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("subject", data.subject);
      fd.set("message", data.message);
      const result = await submitSupportRequest(null, fd);
      if (result.success) {
        toast.success("Message sent. We’ll get back to you soon.");
        setSent(true);
        form.reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground">
        Thanks for reaching out. We’ve received your message.
      </p>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          name="subject"
          label="Subject"
          placeholder="Brief subject"
          required
        />
        <TextAreaField
          name="message"
          label="Message"
          placeholder="Describe your question or issue…"
          required
          rows={5}
        />
        <Button
          type="submit"
          disabled={loading}
          className="rounded-md"
          aria-busy={loading}
        >
          {loading ? "Sending…" : "Send message"}
        </Button>
      </form>
    </FormProvider>
  );
}
