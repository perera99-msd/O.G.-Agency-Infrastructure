"use client";

import ServiceHero from "@/components/services/ServiceHero";
import ServiceGrid from "@/components/services/ServiceGrid";
import WorkflowTimeline from "@/components/services/WorkflowTimeline";
import InteractiveCalculator from "@/components/services/InteractiveCalculator";
import FAQAccordion from "@/components/services/FAQAccordion";
import PartnerForm from "@/components/services/PartnerForm";

export default function ServicesPageClient() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <ServiceHero />
      <ServiceGrid />
      <WorkflowTimeline />
      <InteractiveCalculator />
      <FAQAccordion />
      <PartnerForm />
    </div>
  );
}
