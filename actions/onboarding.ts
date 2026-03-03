"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type OnboardingResult =
  | { success: true }
  | { success: false; error: string };

export async function completeOnboarding(): Promise<OnboardingResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompletedAt: new Date() },
  });

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  return { success: true };
}
