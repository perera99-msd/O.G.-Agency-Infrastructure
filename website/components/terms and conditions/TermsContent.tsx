"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Info, FileText, Scale, HelpCircle, Briefcase, UserCheck, CreditCard, Lock, ArrowUpRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState<string>("acceptance");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections: Section[] = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: <FileText size={16} /> },
    { id: "services", title: "2. Scope of Services", icon: <Briefcase size={16} /> },
    { id: "eligibility", title: "3. Eligibility & Registration", icon: <UserCheck size={16} /> },
    { id: "verification", title: "4. Credential Verification", icon: <ShieldCheck size={16} /> },
    { id: "employer", title: "5. Employer Partners", icon: <ArrowUpRight size={16} /> },
    { id: "fees", title: "6. Fees & Refunds", icon: <CreditCard size={16} /> },
    { id: "intellectual", title: "7. Intellectual Property", icon: <Lock size={16} /> },
    { id: "disclaimer", title: "8. Liability & Disclaimers", icon: <Scale size={16} /> },
    { id: "law", title: "9. Governing Law", icon: <Scale size={16} /> },
    { id: "contact", title: "10. Contact Information", icon: <HelpCircle size={16} /> },
  ];

  useEffect(() => {
    // Scroll observation
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-100px 0px -40% 0px", // Focus in the middle area of viewport
      threshold: [0.1, 0.25, 0.5],
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // accounting for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <section className="w-full bg-main-50 py-16 lg:py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Sticky Sidebar Navigation (Left Column) */}
        <div className="w-full lg:w-1/4 lg:sticky lg:top-[120px] lg:h-[calc(100vh-160px)] flex flex-col justify-between shrink-0">
          <div className="flex flex-col gap-4">
            <div className="border-l-2 border-main-500 pl-4 mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-main-500 font-mono">Jump to Section</span>
              <h3 className="font-heading font-bold text-lg text-main-900 mt-1">Table of Contents</h3>
            </div>
            
            <nav className="flex flex-col gap-1 pr-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-main-300">
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-main-700 text-main-50 shadow-md translate-x-1"
                        : "text-secondary-700 hover:bg-main-300/10 hover:text-main-700"
                    }`}
                  >
                    <span className={isActive ? "text-main-300 animate-pulse" : "text-secondary-400"}>
                      {sec.icon}
                    </span>
                    <span>{sec.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Notice Card */}
          <div className="hidden lg:block mt-8 p-5 rounded-2xl bg-gradient-to-br from-secondary-100 to-main-300/10 border border-main-500/10 shadow-inner-soft">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-main-500 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-main-900 uppercase tracking-wider">Need Help?</span>
                <p className="text-xs text-secondary-900 leading-normal font-medium max-w-none">
                  If you have questions regarding these terms, please contact our support team at <a href="mailto:support@ogagency.com" className="text-main-500 underline font-semibold">support@ogagency.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Document Content (Right Column) */}
        <div className="w-full lg:w-3/4 flex flex-col gap-12 lg:gap-16">
          
          {/* Last Updated Label */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-secondary-500 border-b border-main-900/5 pb-6">
            <span>DOCUMENT REF: OGA-TOS-2026-V1</span>
            <span className="hidden md:inline text-secondary-300">•</span>
            <span>LAST UPDATED: JUNE 26, 2026</span>
          </div>

          {/* Intro Tip */}
          <div className="p-6 rounded-2xl bg-main-300/5 border border-main-300/20 shadow-inner-soft flex items-start gap-4">
            <ShieldCheck className="text-main-300 mt-1 shrink-0" size={24} />
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-heading font-bold text-main-700">Important General Disclaimer</h4>
              <p className="text-sm text-secondary-700 leading-relaxed font-medium max-w-none">
                These terms govern all access and utilization of services provided by O.G. Agency. These terms constitute a legally binding agreement between you, the user (whether a Candidate seeking international job placement or an Employer partnering to source talent), and O.G. Agency. By registering on our website or submitting documents, you certify your unconditional agreement to these terms.
              </p>
            </div>
          </div>

          {/* Section 1: Acceptance of Terms */}
          <article id="acceptance" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><FileText size={20} /></span>
              1. Acceptance of Terms
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              By accessing, browsing, or using the O.G. Agency website, portal, and recruitment systems (collectively, the "Platform"), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any local laws.
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              If you do not agree with any of these terms, you are prohibited from using or accessing the Platform. The materials contained in this website are protected by applicable copyright and trademark laws.
            </p>
          </article>

          {/* Section 2: Scope of Services */}
          <article id="services" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Briefcase size={20} /></span>
              2. Scope of Services
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              O.G. Agency operates as a specialized digital recruitment and staffing advisor connecting global candidates with international employers. Our services include:
            </p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li>Candidate screening, skills profiling, and recruitment placement matching.</li>
              <li>Verification of professional credentials, backgrounds, and qualifications.</li>
              <li>Visa process consultation and tracking dashboard assistance.</li>
              <li>Corporate compliance verification and client company talent sourcing pipeline integration.</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base mt-2">
              You acknowledge that O.G. Agency operates as an agency partner. The issuance of job offers, employment contracts, and visas is subject to third-party authorization (e.g., employers and relevant embassy/immigration bureaus) and is not guaranteed by O.G. Agency.
            </p>
          </article>

          {/* Section 3: Eligibility & Registration */}
          <article id="eligibility" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><UserCheck size={20} /></span>
              3. Eligibility & Registration
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              To register for an account or utilize our placement services, you must be at least 18 years of age and possess the legal capacity to enter into binding agreements.
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              You agree to provide accurate, complete, and updated information during the registration process. You are solely responsible for safeguarding your account credentials, and you agree to notify O.G. Agency immediately of any unauthorized access or breach of security.
            </p>
          </article>

          {/* Section 4: Credential Verification */}
          <article id="verification" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><ShieldCheck size={20} /></span>
              4. Candidate Obligations & Credential Verification
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              Candidates submitting resumes, educational achievements, or professional certificates undergo validation. We utilize state-of-the-art integrity verification protocols (including cryptographic blockchain verification where applicable) to confirm validity.
            </p>
            <blockquote className="bg-main-300/5 border-l-4 border-main-500 p-4 rounded-r-xl italic my-2">
              <p className="text-sm font-semibold text-main-700 leading-relaxed max-w-none">
                "Submitting forged documentation, misleading work histories, or falsified licenses is strictly prohibited. O.G. Agency reserves the immediate right to terminate accounts and report fraudulent materials to legal authorities and prospective employers."
              </p>
            </blockquote>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              By using our service, you grant O.G. Agency the license to verify your certificates with universities, background check vendors, and past employers.
            </p>
          </article>

          {/* Section 5: Employer Partners */}
          <article id="employer" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><ArrowUpRight size={20} /></span>
              5. Employer Partners & Compliance
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              For corporate client partners utilizing our Platform to hire talent:
            </p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li>You agree to comply with all local and international labor laws, equal employment opportunity principles, and data protection guidelines.</li>
              <li>You agree to utilize candidate data strictly for authorized recruiting procedures, complying with the General Data Protection Regulation (GDPR) and regional confidentiality laws.</li>
              <li>Any attempts to circumvent our recruitment matching fees by contacting candidates directly to negotiate employment separate from the O.G. Agency platform shall trigger full placement fee penalties under our service agreement.</li>
            </ul>
          </article>

          {/* Section 6: Fees & Refunds */}
          <article id="fees" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><CreditCard size={20} /></span>
              6. Payments, Fees & Refund Policy
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              Fees for immigration assistance, premium skills tests, and corporate recruitment matching are clearly communicated prior to charge. You agree to settle all invoices according to the agreed payment terms.
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              Unless otherwise specified in a separate corporate service agreement, all fees paid for assessment services, verification processing, and consulting are non-refundable once the work begins. Should a candidate's visa get rejected solely due to a document filing error on O.G. Agency's part, a full review and partial refund/re-filing policy will apply.
            </p>
          </article>

          {/* Section 7: Intellectual Property */}
          <article id="intellectual" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Lock size={20} /></span>
              7. Intellectual Property Rights
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              All proprietary code, branding, layouts, graphic representations, logo marks, and copywriting on the Platform are the exclusive property of O.G. Agency.
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              You are granted a limited, non-transferable, revocable license to access the recruitment portal for individual job searches or candidate management. You may not copy, extract database content (via scraping or web-crawlers), redistribute, or reverse-engineer the O.G. Agency software systems.
            </p>
          </article>

          {/* Section 8: Liability & Disclaimers */}
          <article id="disclaimer" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Scale size={20} /></span>
              8. Liability Disclaimers & Limitations
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              The services and documentation on O.G. Agency's Platform are provided on an "as is" and "as available" basis. We make no guarantees, expressed or implied, regarding candidate success, final employment terms, or secure embassy processing times.
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              In no event shall O.G. Agency, its suppliers, or licensing partners be liable for any indirect, special, incidental, or consequential damages (including loss of profits, data, employment opportunities, or business interruption) arising from the use or inability to use our systems.
            </p>
          </article>

          {/* Section 9: Governing Law */}
          <article id="law" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Scale size={20} /></span>
              9. Governing Law & Jurisdiction
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              These terms of service shall be governed by, construed, and enforced in accordance with the laws of Sri Lanka, without giving effect to any principles of conflicts of law.
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              You agree that any legal action, dispute resolution process, or litigation between you and O.G. Agency shall be filed exclusively in the courts located in Colombo, Sri Lanka, and you hereby consent to the personal jurisdiction of such courts.
            </p>
          </article>

          {/* Section 10: Contact Information */}
          <article id="contact" className="scroll-mt-32 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><HelpCircle size={20} /></span>
              10. Modifications & Contact Information
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              O.G. Agency reserves the right to revise these Terms of Service at any time without prior notification. By continuing to use the Platform, you agree to be bound by the then-current version of these terms.
            </p>
            
            <div className="mt-6 p-6 rounded-2xl bg-secondary-900 text-main-50 flex flex-col gap-4">
              <h5 className="text-main-300 font-heading font-bold text-lg">O.G. Agency Legal Department</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-main-50/80">
                <div className="flex flex-col gap-1">
                  <span className="uppercase text-[9px] tracking-wider text-main-300">Office Address</span>
                  <span>O.G. Agency, Level 15, East Tower</span>
                  <span>World Trade Center, Colombo 01, Sri Lanka</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="uppercase text-[9px] tracking-wider text-main-300">Digital Queries</span>
                  <span>Email: legal@ogagency.com</span>
                  <span>Web: www.ogagency.com</span>
                </div>
              </div>
            </div>
          </article>

        </div>

      </div>
    </section>
  );
}
