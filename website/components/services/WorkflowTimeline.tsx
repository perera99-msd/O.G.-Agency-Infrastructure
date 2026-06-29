// components/services/WorkflowTimeline.tsx
"use client";

import { motion } from "framer-motion";
import { ClipboardList, UserSearch, ShieldCheck, FileText, Send } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Tell Us What You Need",
    description: "You share your job roles, required skills, and timeline. We set up your hiring project in our system.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "We Find the Right People",
    description: "Our team searches our global network and shortlists candidates that match your requirements.",
    icon: UserSearch,
  },
  {
    step: "03",
    title: "We Verify Every Candidate",
    description: "We check education, work history, and references so you can be confident in their background.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "We Handle All Paperwork",
    description: "We manage visa applications, work permits, and medical checks everything to keep the process legal and fast.",
    icon: FileText,
  },
  {
    step: "05",
    title: "Your Team Arrives & Starts",
    description: "We coordinate flights, accommodation, and orientation. You track progress online and welcome your new hires.",
    icon: Send,
  },
];

export default function WorkflowTimeline() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-main-50 to-secondary-100/50" id="workflow">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading text-main-700">
            How It Works
          </h2>
          <p className="text-lg text-secondary-700 max-w-prose mx-auto">
            A simple, transparent process that takes the stress out of international hiring.
          </p>
        </div>

        <div className="relative border-l border-secondary-300 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-secondary-300 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="relative mb-16 last:mb-0 md:flex md:justify-between items-center w-full">
                <div className="absolute top-0 left-[-17px] md:left-1/2 md:translate-x-[-50%] flex items-center justify-center w-8 h-8 rounded-full bg-main-700 text-main-50 border-4 border-white shadow-md z-10">
                  <span className="text-xs font-bold font-mono">{step.step}</span>
                </div>

                <div className={`hidden md:block w-[45%] ${isEven ? "order-1" : "order-2"}`} />

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