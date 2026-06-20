"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, ShieldAlert, FileText, Send } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Sourcing Planning & Setup",
    description: "Submit your workforce demands. We configure your candidate criteria, job roles, and relocation timelines in our central system.",
    icon: Search,
  },
  {
    step: "02",
    title: "AI Screening & Shortlisting",
    description: "Our algorithms filter global candidate listings, extract skills, verify compliance, and compile a shortlist of verified individuals.",
    icon: UserCheck,
  },
  {
    step: "03",
    title: "Credential Vault Verification",
    description: "Candidates upload transcripts and credentials to our Blockchain Vault. We cryptographically sign and verify authenticity instantly.",
    icon: FileText,
  },
  {
    step: "04",
    title: "Visa Processing & Compliance",
    description: "Our legal workflows handle embassy clearance, work permits, and medical scheduling, maintaining strict tracking throughout.",
    icon: ShieldAlert,
  },
  {
    step: "05",
    title: "Deployment & Integration",
    description: "Workers arrive with flight details integrated. You track progress live on the PWA, ensuring a seamless start day.",
    icon: Send,
  },
];

export default function WorkflowTimeline() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-main-50 to-secondary-100/50" id="workflow">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading text-main-700">
            How Sourcing Works
          </h2>
          <p className="text-lg text-secondary-700 max-w-prose mx-auto">
            A secure, automated onboarding path that takes the friction out of cross-border recruitment.
          </p>
        </div>

        <div className="relative border-l border-secondary-300 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-secondary-300 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="relative mb-16 last:mb-0 md:flex md:justify-between items-center w-full">
                {/* Timeline node marker */}
                <div className="absolute top-0 left-[-17px] md:left-1/2 md:translate-x-[-50%] flex items-center justify-center w-8 h-8 rounded-full bg-main-700 text-main-50 border-4 border-white shadow-md z-10">
                  <span className="text-xs font-bold font-mono">{step.step}</span>
                </div>

                {/* Left side card placeholder for layout balance */}
                <div className={`hidden md:block w-[45%] ${isEven ? "order-1" : "order-2"}`} />

                {/* Main Card */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 90, damping: 15 }}
                  className={`w-full md:w-[45%] pl-6 md:pl-0 ${isEven ? "order-2" : "order-1"}`}
                >
                  <div className="bg-white border border-secondary-100 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-main-500/10 text-main-700">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-semibold font-heading text-main-700">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-secondary-900 font-sans leading-relaxed text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
