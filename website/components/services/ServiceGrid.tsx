"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Landmark, ShieldCheck, PlaneTakeoff, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "AI-Powered Talent Matching",
    description: "Accelerate your search with our intelligent candidate vetting. Parse CVs instantly and match profiles based on skills, credentials, and requirements.",
    icon: BrainCircuit,
    color: "text-main-300",
    bullets: ["Auto CV parsing and translation", "Skills and experience matching index", "Automated interview pre-screening"],
  },
  {
    title: "Visa & Compliance Processing",
    description: "Mitigate immigration risks. We manage documentation and legal requirements directly with embassies to deliver stress-free visa solutions.",
    icon: Landmark,
    color: "text-secondary-300",
    bullets: ["Full legal document preparation", "Embassy appointment and tracking", "Local labor law compliance checks"],
  },
  {
    title: "Blockchain Verification Vault",
    description: "Prevent fraud and speed up verification. Store and validate employee transcripts, background checks, and certifications on an immutable ledger.",
    icon: ShieldCheck,
    color: "text-main-500",
    bullets: ["Instant credential verification", "Tamper-proof storage vault", "GDPR-compliant security keys"],
  },
  {
    title: "Deployment & Onboarding Support",
    description: "We handle the logistics of relocating personnel, including flight arrangements, transit tracking, housing assistance, and local orientation.",
    icon: PlaneTakeoff,
    color: "text-secondary-500",
    bullets: ["Travel booking and flight coordination", "Local orientation seminars", "Ongoing worker support lines"],
  },
];

export default function ServiceGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 80, damping: 15 },
    },
  };

  return (
    <section className="py-24 px-6 bg-main-50" id="core-services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading text-main-700">
            Our Corporate Sourcing Ecosystem
          </h2>
          <p className="text-lg text-secondary-700 max-w-prose mx-auto">
            From initial identification of candidates to final onboarding and relocation, O.G. Agency operates as a comprehensive, digitally optimized partner.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "var(--shadow-card-hover)" }}
                className="bg-white border border-secondary-100 rounded-2xl p-8 transition-shadow shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-xl bg-main-900/5 ${service.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-semibold font-heading text-main-700">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-secondary-900 mb-6 font-sans">
                    {service.description}
                  </p>
                </div>
                <div className="border-t border-secondary-100 pt-6 mt-4">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-secondary-700">
                        <CheckCircle2 className="w-4 h-4 text-main-500 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
