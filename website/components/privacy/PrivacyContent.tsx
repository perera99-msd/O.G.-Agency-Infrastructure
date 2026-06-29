"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Info, User, Database, 
  Users, Eye, FileText, Lock, 
  Cookie, Mail, Scale, HelpCircle
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function PrivacyContent() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections: Section[] = [
    { id: "intro", title: "1. Introduction", icon: <Info size={16} /> },
    { id: "collect", title: "2. Information We Collect", icon: <Database size={16} /> },
    { id: "use", title: "3. How We Use Your Data", icon: <Users size={16} /> },
    { id: "share", title: "4. Data Sharing", icon: <Eye size={16} /> },
    { id: "security", title: "5. Data Security", icon: <Lock size={16} /> },
    { id: "rights", title: "6. Your Rights", icon: <ShieldCheck size={16} /> },
    { id: "cookies", title: "7. Cookies & Tracking", icon: <Cookie size={16} /> },
    { id: "retention", title: "8. Data Retention", icon: <FileText size={16} /> },
    { id: "children", title: "9. Children's Privacy", icon: <User size={16} /> },
    { id: "changes", title: "10. Changes to Policy", icon: <Scale size={16} /> },
    { id: "contact", title: "11. Contact Us", icon: <Mail size={16} /> },
  ];

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-100px 0px -40% 0px",
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
      const offset = 120;
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
        
        {/* Sticky Sidebar */}
        <div className="w-full lg:w-1/4 lg:sticky lg:top-[120px] lg:h-[calc(100vh-160px)] flex flex-col justify-between shrink-0">
          <div className="flex flex-col gap-4">
            <div className="border-l-2 border-main-500 pl-4 mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-main-500 font-mono">Jump to Section</span>
              <h3 className="font-heading font-bold text-lg text-main-900 mt-1">Contents</h3>
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

          {/* Quick Help Card */}
          <div className="hidden lg:block mt-8 p-5 rounded-2xl bg-gradient-to-br from-secondary-100 to-main-300/10 border border-main-500/10 shadow-inner-soft">
            <div className="flex items-start gap-3">
              <HelpCircle size={18} className="text-main-500 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-main-900 uppercase tracking-wider">Privacy Questions?</span>
                <p className="text-xs text-secondary-900 leading-normal font-medium max-w-none">
                  If you have concerns about your data, please email us at <a href="mailto:privacy@ogagency.com" className="text-main-500 underline font-semibold">privacy@ogagency.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-12 lg:gap-16">
          
          {/* Document Header */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-secondary-500 border-b border-main-900/5 pb-6">
            <span>DOCUMENT REF: OGA-PP-2026-V1</span>
            <span className="hidden md:inline text-secondary-300">•</span>
            <span>LAST UPDATED: JUNE 27, 2026</span>
          </div>

          {/* Intro Card */}
          <div className="p-6 rounded-2xl bg-main-300/5 border border-main-300/20 shadow-inner-soft flex items-start gap-4">
            <ShieldCheck className="text-main-300 mt-1 shrink-0" size={24} />
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-heading font-bold text-main-700">Our Commitment to Privacy</h4>
              <p className="text-sm text-secondary-700 leading-relaxed font-medium max-w-none">
                O.G. Agency is committed to protecting your personal information. This policy explains what data we collect, why we collect it, and how we handle it. We comply with the Sri Lankan Data Protection Act and international standards (GDPR, CCPA) where applicable.
              </p>
            </div>
          </div>

          {/* SECTION 1 */}
          <article id="intro" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Info size={20} /></span>
              1. Introduction
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              This Privacy Policy describes how O.G. Agency ("we", "us", or "our") collects, uses, stores, and shares personal information when you use our website, mobile application, recruitment portal, or interact with our services (collectively, the "Platform").
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              By using our Platform, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our services.
            </p>
          </article>

          {/* SECTION 2 */}
          <article id="collect" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Database size={20} /></span>
              2. Information We Collect
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">We collect various types of information to provide and improve our services:</p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li><strong>Personal Identification Data:</strong> Full name, date of birth, passport details, national ID, contact information (email, phone, address).</li>
              <li><strong>Professional & Employment Data:</strong> Resume/CV, work history, educational qualifications, skills, certifications, references, and job preferences.</li>
              <li><strong>Visa & Immigration Data:</strong> Passport scans, previous visa records, medical history (where required for visa applications), and travel documents.</li>
              <li><strong>Usage Data:</strong> How you interact with our Platform (pages visited, time spent, clicks, IP address, browser type, device information).</li>
              <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance user experience and analyze traffic (see Section 7).</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We collect data directly from you when you register, upload documents, submit inquiries, or interact with our forms. We may also receive data from third-party verification services (e.g., background check providers) with your consent.
            </p>
          </article>

          {/* SECTION 3 */}
          <article id="use" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Users size={20} /></span>
              3. How We Use Your Data
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">Your information is used for the following purposes:</p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li>To match candidates with suitable job opportunities and employer requirements.</li>
              <li>To process visa applications, work permits, and other immigration formalities.</li>
              <li>To verify credentials, qualifications, and references through third-party background check services.</li>
              <li>To communicate with you about your account, applications, and relevant job alerts.</li>
              <li>To improve our Platform, analyze usage patterns, and personalize your experience.</li>
              <li>To comply with legal obligations and regulatory requirements (SLBFE, immigration authorities, etc.).</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We will never use your data for purposes incompatible with this policy without obtaining your explicit consent.
            </p>
          </article>

          {/* SECTION 4 */}
          <article id="share" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Eye size={20} /></span>
              4. Data Sharing & Disclosure
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We may share your data with the following categories of recipients, strictly for the purposes described above:
            </p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li><strong>Employer Partners:</strong> When you apply for a job, we share your CV and relevant information with the hiring company.</li>
              <li><strong>Service Providers:</strong> Third-party vendors who help us operate (e.g., hosting, analytics, background verification, translation, and legal services).</li>
              <li><strong>Government & Regulatory Bodies:</strong> Sri Lanka Bureau of Foreign Employment (SLBFE), embassies, immigration departments, and other authorities as required by law.</li>
              <li><strong>Professional Advisors:</strong> Lawyers, auditors, and consultants who assist us in compliance and business operations.</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes. We require all third parties to respect your data and comply with applicable privacy laws.
            </p>
          </article>

          {/* SECTION 5 */}
          <article id="security" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Lock size={20} /></span>
              5. Data Security
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li>Data is encrypted in transit (SSL/TLS) and at rest.</li>
              <li>Access to personal data is restricted to authorized personnel on a need-to-know basis.</li>
              <li>We conduct regular security assessments and vulnerability scans.</li>
              <li>All third-party processors are contractually bound to maintain similar security standards.</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we continuously update our practices to mitigate risks.
            </p>
          </article>

          {/* SECTION 6 */}
          <article id="rights" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><ShieldCheck size={20} /></span>
              6. Your Rights
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              Depending on your jurisdiction, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your data, subject to legal retention obligations.</li>
              <li><strong>Restriction:</strong> Request that we limit processing of your data.</li>
              <li><strong>Object:</strong> Object to certain processing (e.g., direct marketing).</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service provider.</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              To exercise any of these rights, contact us at <a href="mailto:privacy@ogagency.com" className="text-main-500 underline font-semibold">privacy@ogagency.com</a>. We will respond within 30 days.
            </p>
          </article>

          {/* SECTION 7 */}
          <article id="cookies" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Cookie size={20} /></span>
              7. Cookies & Tracking Technologies
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We use cookies and similar technologies to enhance your experience, analyze usage, and improve our services. Cookies are small text files stored on your device.
            </p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li><strong>Essential Cookies:</strong> Necessary for site functionality (e.g., login sessions).</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site (e.g., Google Analytics).</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              You can manage cookie preferences in your browser settings. However, disabling certain cookies may affect site functionality. We do not use cookies for targeted advertising.
            </p>
          </article>

          {/* SECTION 8 */}
          <article id="retention" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><FileText size={20} /></span>
              8. Data Retention
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
            </p>
            <ul className="list-disc pl-6 text-secondary-900 flex flex-col gap-2 font-medium text-sm">
              <li>Candidate profiles: Retained for up to 5 years after last activity, unless you request deletion.</li>
              <li>Visa and immigration documents: Retained for up to 10 years to comply with regulatory requirements.</li>
              <li>Usage data and analytics: Retained for up to 2 years.</li>
            </ul>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              When data is no longer needed, we securely delete or anonymize it.
            </p>
          </article>

          {/* SECTION 9 */}
          <article id="children" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><User size={20} /></span>
              9. Children's Privacy
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              Our services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us, and we will take steps to delete such information.
            </p>
          </article>

          {/* SECTION 10 */}
          <article id="changes" className="scroll-mt-32 border-b border-main-900/5 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Scale size={20} /></span>
              10. Changes to This Policy
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated "Last Updated" date. You are advised to review this policy periodically.
            </p>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              Your continued use of the Platform after any changes constitutes acceptance of the new policy.
            </p>
          </article>

          {/* SECTION 11 */}
          <article id="contact" className="scroll-mt-32 pb-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-main-700 flex items-center gap-3">
              <span className="p-2 bg-main-300/10 text-main-500 rounded-lg"><Mail size={20} /></span>
              11. Contact Us
            </h2>
            <p className="text-secondary-900 leading-relaxed font-medium text-base">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="mt-6 p-6 rounded-2xl bg-secondary-900 text-main-50 flex flex-col gap-4">
              <h5 className="text-main-300 font-heading font-bold text-lg">O.G. Agency Privacy Team</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-main-50/80">
                <div className="flex flex-col gap-1">
                  <span className="uppercase text-[9px] tracking-wider text-main-300">Email</span>
                  <span><a href="mailto:privacy@ogagency.com" className="text-main-50 hover:text-main-300 transition-colors">privacy@ogagency.com</a></span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="uppercase text-[9px] tracking-wider text-main-300">Postal Address</span>
                  <span>O.G. Agency, No. 586/3, Walgama, Nagahawatta Malwana, Western Province, Sri Lanka.</span>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}