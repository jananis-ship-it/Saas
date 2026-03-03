import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export type SessionUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  onboardingCompletedAt: Date | null;
};

/** Get current Clerk user and sync/return DB user. Returns null if not signed in. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { userId: clerkId, sessionClaims } = await auth();
  if (!clerkId) return null;

  const email = (sessionClaims?.email as string) ?? "";
  const name = (sessionClaims?.firstName && sessionClaims?.lastName)
    ? `${sessionClaims.firstName} ${sessionClaims.lastName}`
    : (sessionClaims?.firstName as string) ?? (sessionClaims?.email as string) ?? "";
  const imageUrl = sessionClaims?.image as string | undefined;

  const user = await prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email: email || `user-${clerkId}@placeholder.local`,
      name: name || null,
      imageUrl: imageUrl || null,
    },
    update: {
      email: email || undefined,
      name: name || undefined,
      imageUrl: imageUrl ?? undefined,
    },
  });

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
    onboardingCompletedAt: user.onboardingCompletedAt,
  };
}

/** Require auth; redirect to sign-in if not authenticated. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/sign-in?redirect_url=/dashboard");
    throw new Error("Unauthorized");
  }
  return user;
}
