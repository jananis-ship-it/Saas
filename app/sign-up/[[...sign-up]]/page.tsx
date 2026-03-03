import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "rounded-xl shadow-md",
          },
        }}
        afterSignUpUrl="/onboarding"
        signInUrl="/sign-in"
      />
    </div>
  );
}
