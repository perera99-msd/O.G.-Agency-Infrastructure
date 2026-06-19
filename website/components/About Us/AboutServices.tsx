"use client";

import { motion } from "framer-motion";
import { Globe2, Database, ClipboardCheck, Briefcase } from "lucide-react";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutServices() {
  const services = [
    {
      icon: Briefcase,
      title: "Manpower Supplies & Consulting",
      description:
        "Comprehensive consulting, advisory, and promotion services for recruiting manpower of all grades, qualifications, and skill sets.",
    },
    {
      icon: Database,
      title: "Strong Talent Database",
      description:
        "We maintain a constantly updated database of highly experienced professionals, skilled technicians, and industrious semi-skilled personnel.",
    },
    {
      icon: ClipboardCheck,
      title: "Full-Cycle Recruitment & Certification",
      description:
        "We manage the entire recruitment pipeline: screening, conducting interviews, physical & aptitude testing, and official qualification certifications.",
    },
  ];

  const countries = [
    { name: "Romania", code: "RO", region: "Europe" },
    { name: "Russia", code: "RU", region: "Eurasia" },
    { name: "Dubai (UAE)", code: "AE", region: "Middle East" },
    { name: "Jordan", code: "JO", region: "Middle East" },
    { name: "Malaysia", code: "MY", region: "Southeast Asia" },
  ];

  return (
    <section className="py-24 bg-main-50 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <FadeUp>
          <div className="mb-20 border-b border-secondary-200/50 pb-8">
            <p className="font-mono text-xs tracking-[0.2em] text-main-500 uppercase mb-3 font-semibold">
              Our Services & Scope
            </p>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-main-900 leading-tight max-w-2xl">
              Connecting qualified talent to global employers
            </h2>
          </div>
        </FadeUp>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeUp key={service.title} delay={index * 0.08}>
                <div className="h-full bg-white border border-secondary-100 hover:border-main-500/20 hover:shadow-xl hover:shadow-main-500/5 rounded-2xl p-8 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-main-50 flex items-center justify-center mb-6 text-main-500">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-main-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-secondary-700 font-sans text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Destinations Box */}
        <FadeUp delay={0.15}>
          <div className="bg-gradient-to-br from-main-900 to-[#000c10] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-main-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-md">
                <div className="flex items-center gap-2.5 mb-4 text-main-300">
                  <Globe2 size={20} strokeWidth={1.5} />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold">Global Presence</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                  Active Recruitment Destinations
                </h3>
                <p className="text-secondary-200/90 font-sans text-sm md:text-base leading-relaxed">
                  OG Agency facilitates official placements and processes visas for workers in major labor markets across Europe, Eurasia, and Asia.
                </p>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:max-w-md">
                {countries.map((c) => (
                  <div
                    key={c.name}
                    className="flex flex-col p-4 bg-white/5 border border-white/10 hover:border-main-500/40 rounded-xl transition-colors duration-300"
                  >
                    <span className="text-[10px] font-mono tracking-widest text-main-300 font-bold uppercase mb-1">
                      {c.region}
                    </span>
                    <span className="font-heading font-semibold text-sm text-white">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
