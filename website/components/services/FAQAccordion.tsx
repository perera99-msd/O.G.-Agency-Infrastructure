"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does O.G. Agency verify candidate credentials?",
    answer: "Candidates upload transcripts and credentials to our Customer PWA. We cross-verify records with issuing boards, and write the signed verification records to our Blockchain Vault. This guarantees their authenticity and prevents forgery, simplifying the onboarding audit.",
  },
  {
    question: "What industries do you specialize in sourcing?",
    answer: "We support a wide array of sectors, including IT & Engineering, Healthcare, Construction, Hospitality, and Agriculture. Each pipeline is tailored with specific compliance checklists to meet local labor requirements.",
  },
  {
    question: "What is the average timeline for deploying international recruits?",
    answer: "Sourcing and deployment timelines generally range between 35 and 75 days. When you utilize the Blockchain Verification Vault and Consulate Fast-tracking, processing delays are reduced, saving up to 25 days on average.",
  },
  {
    question: "How do you protect candidate data and corporate documents?",
    answer: "All documents are encrypted in transit and at rest. Access is governed by role-based privacy restrictions within our backend, ensuring that only designated legal team members and HR coordinators can view sensitive documents.",
  },
  {
    question: "Is there a portal where we can track application progress?",
    answer: "Yes. Corporate partners receive custom access keys to our Admin Dashboard, which enables real-time tracking of candidate selections, interview schedules, visa application steps, and travel bookings.",
  },
];

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 bg-main-50" id="faqs">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4 text-main-500">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading text-main-700">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-secondary-700 max-w-prose mx-auto">
            Get answers to common inquiries regarding compliance, blockchain security, and recruitment timelines.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="border border-secondary-100 rounded-2xl bg-white shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-main-50/50 transition-colors cursor-pointer"
                >
                  <span className="font-heading font-medium text-lg text-main-700 pr-4">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-lg bg-main-900/5 text-main-700 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-secondary-50/50">
                        <p className="text-secondary-900 text-base font-sans leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
