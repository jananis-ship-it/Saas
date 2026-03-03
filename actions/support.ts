"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { supportRequestSchema } from "@/lib/validations/support";

export type SupportActionResult =
  | { success: true; data?: { id: string } }
  | { success: false; error: string };

export async function submitSupportRequest(
  _prev: unknown,
  formData: FormData
): Promise<SupportActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "You must be signed in to submit a request" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = supportRequestSchema.safeParse({
    subject: raw.subject,
    message: raw.message,
  });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    return { success: false, error: Object.values(err).flat().join(" ") || "Validation failed" };
  }

  const req = await prisma.supportRequest.create({
    data: {
      userId: user.id,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  return { success: true, data: { id: req.id } };
}
