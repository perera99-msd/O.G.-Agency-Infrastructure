import type { Metadata } from "next";
import TermsHero from "@/components/terms and conditions/TermsHero";
import TermsContent from "@/components/terms and conditions/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service | O.G. Agency",
  description: "Read the Terms and Conditions of Service for O.G. Agency. Learn about our global recruiting platform, credentials verification, visa consultation, and partner guidelines.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <TermsHero />
      <TermsContent />
    </div>
  );
}
