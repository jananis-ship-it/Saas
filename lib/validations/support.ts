import { z } from "zod";

export const supportRequestSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;
