// components/services/ServiceGrid.tsx
"use client";

import { motion } from "framer-motion";
import { Users, FileCheck, ShieldCheck, PlaneTakeoff, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "Smart Candidate Matching",
    description: "We find the right people for your open roles quickly. No more sifting through hundreds of resumes.",
    icon: Users,
    color: "text-main-300",
    bullets: [
      "Search candidates from our global database",
      "Match skills, experience, and language abilities",
      "Pre‑screen interviews to save your time",
    ],
  },
  {
    title: "Visa & Work Permit Support",
    description: "We handle all immigration paperwork so your hires can start on time, without legal delays.",
    icon: FileCheck,
    color: "text-secondary-300",
    bullets: [
      "Complete document preparation",
      "Embassy appointment scheduling",
      "Local labour law compliance",
    ],
  },
  {
    title: "Credential Verification",
    description: "We confirm every candidate's education and work history so you can trust their qualifications.",
    icon: ShieldCheck,
    color: "text-main-500",
    bullets: [
      "Verify degrees, certificates, and references",
      "Protect against forged credentials",
      "Secure, auditable records",
    ],
  },
  {
    title: "Relocation & Onboarding",
    description: "From flights to accommodation to orientation we make sure your new employees settle in smoothly.",
    icon: PlaneTakeoff,
    color: "text-secondary-500",
    bullets: [
      "Travel booking and flight tracking",
      "Local orientation and culture training",
      "24/7 support for your new hires",
    ],
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
            What We Do for You
          </h2>
          <p className="text-lg text-secondary-700 max-w-prose mx-auto">
            We take care of the entire hiring journey from finding the right people to getting them settled in your company.
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