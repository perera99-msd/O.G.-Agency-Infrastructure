// components/services/FAQAccordion.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do you make sure candidates' qualifications are real?",
    answer: "We ask candidates to upload their degrees, certificates, and references. Our team then contacts the issuing institutions and previous employers to confirm everything. All records are kept secure so you can trust the information.",
  },
  {
    question: "What types of businesses do you work with?",
    answer: "We support many industries IT, engineering, healthcare, construction, hospitality, and agriculture. We customise our approach to fit the specific rules and needs of each sector.",
  },
  {
    question: "How long does it take to hire someone through you?",
    answer: "Usually between 35 and 75 days, depending on the role and country. Using our verification and expedited visa services can cut that time by up to 25 days.",
  },
  {
    question: "Is my company's information safe with you?",
    answer: "Absolutely. All documents are encrypted, and we use strict access controls. Only the people who need to see your data (like your account manager) have permission no one else.",
  },
  {
    question: "Can I track the hiring progress online?",
    answer: "Yes. We give you a secure login to our dashboard where you can see real‑time updates on candidate selections, interviews, visa steps, and travel arrangements all in one place.",
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
            Quick answers to the most common things people ask us.
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