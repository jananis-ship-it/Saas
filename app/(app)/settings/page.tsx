import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/app/PageHeader";
import { SectionCard } from "@/components/app/SectionCard";
import { ProfileForm } from "./ProfileForm";
import { DangerZone } from "./DangerZone";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your profile and account."
      />
      <SectionCard title="Profile" description="Update your display name.">
        <ProfileForm defaultName={user.name ?? ""} />
      </SectionCard>
      <DangerZone />
    </div>
  );
}
