import type { Metadata } from "next";
import PrivacyHero from "@/components/privacy/PrivacyHero";
import PrivacyContent from "@/components/privacy/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | O.G. Agency",
  description: "Learn how O.G. Agency collects, uses, and protects your personal data. Our privacy policy explains your rights and our commitments to data security.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <PrivacyHero />
      <PrivacyContent />
    </div>
  );
}