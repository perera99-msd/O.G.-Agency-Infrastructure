import type { Metadata } from "next";
import ServicesPageClient from "@/components/services/ServicesPageClient";

export const metadata: Metadata = {
  title: "Enterprise Sourcing & Global Recruitment Services | O.G. Agency",
  description: "Streamline your international talent acquisition, compliance, and visa workflows. Partner with O.G. Agency for blockchain-verified credentials and end-to-end recruitment pipelines.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}