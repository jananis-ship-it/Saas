"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validations/profile";

export type ProfileActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfile(
  _prev: unknown,
  formData: FormData
): Promise<ProfileActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse({ name: raw.name });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    return { success: false, error: Object.values(err).flat().join(" ") || "Validation failed" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
