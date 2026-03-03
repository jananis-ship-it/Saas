import { PageHeader } from "@/components/app/PageHeader";
import { SectionCard } from "@/components/app/SectionCard";
import { HelpContent } from "./HelpContent";
import { SupportForm } from "./SupportForm";

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Help & support"
        description="Documentation and contact form."
      />
      <HelpContent />
      <SectionCard
        title="Contact us"
        description="Send a message and we’ll get back to you."
      >
        <SupportForm />
      </SectionCard>
    </div>
  );
}
