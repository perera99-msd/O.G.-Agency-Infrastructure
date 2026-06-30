import type { Metadata } from "next";
import AppHero from "@/components/app/AppHero";
import AppInstallWalkthrough from "@/components/app/AppInstallWalkthrough";
import AppFeatureShowcase from "@/components/app/AppFeatureShowcase";

export const metadata: Metadata = {
  title: "Download O.G. Relocation PWA Portal | O.G. Agency",
  description: "Install the official O.G. Agency Progressive Web App (PWA) on iOS or Android for 24/7 real-time visa stage tracking, secure contract storage, and direct liaison chat.",
};

export default function AppPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <AppHero />
      <AppInstallWalkthrough />
      <AppFeatureShowcase />
    </div>
  );
}
