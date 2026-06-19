"use client";

import { motion } from "framer-motion";
import { Award, FileSpreadsheet, MapPin, PhoneCall, Mail } from "lucide-react";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Credentials() {
  const credentials = [
    {
      icon: FileSpreadsheet,
      label: "Business Registration",
      value: "W/99257 Sri Lanka",
      hint: "Registered Corporate Entity",
    },
    {
      icon: Award,
      label: "SLBFE License Number",
      value: "License No. 2751",
      hint: "Sri Lanka Bureau of Foreign Employment",
    },
  ];

  const contactDetails = [
    {
      icon: MapPin,
      label: "Corporate Office Address",
      value: "No. 586/3, Walgama, Nagahawatta Malwana,\nWestern Province, Sri Lanka.",
      href: "https://maps.google.com/?q=No.+586/3,+Walgama,+Nagahawatta+Malwana,+Western+Province,+Sri+Lanka",
      isAddress: true,
    },
    {
      icon: PhoneCall,
      label: "Primary Contact Number",
      value: "+94 112 476 348",
      href: "tel:+94112476348",
    },
    {
      icon: Mail,
      label: "Primary Email Address",
      value: "ogwasantha@gmail.com",
      href: "mailto:ogwasantha@gmail.com",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#000c10] to-main-900 text-white px-6 md:px-12 relative overflow-hidden">
      {/* Visual glowing orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-main-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-20">
            <p className="font-mono text-xs tracking-[0.2em] text-main-300 uppercase mb-3 font-semibold">
              Official Verification
            </p>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight max-w-2xl mx-auto">
              Corporate Credentials & Contact
            </h2>
            <div className="w-12 h-[2px] bg-main-500 mx-auto mt-6" />
          </div>
        </FadeUp>

        {/* Credentials and Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Column 1: Credentials */}
          <div className="space-y-6">
            <FadeUp>
              <h3 className="text-xl font-heading font-bold text-white mb-6 border-b border-white/10 pb-3">
                Government Registrations
              </h3>
            </FadeUp>
            
            <div className="space-y-6">
              {credentials.map((cred, i) => {
                const Icon = cred.icon;
                return (
                  <FadeUp key={cred.label} delay={i * 0.08}>
                    <div className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-main-500/30 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-main-500/10 border border-main-500/20 flex items-center justify-center text-main-300 flex-shrink-0">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] tracking-widest text-main-300 uppercase mb-1">
                          {cred.label}
                        </p>
                        <p className="font-heading font-bold text-base text-white">
                          {cred.value}
                        </p>
                        <p className="text-xs text-secondary-300 mt-1 font-sans">
                          {cred.hint}
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>

          {/* Column 2: Contacts */}
          <div className="space-y-6">
            <FadeUp>
              <h3 className="text-xl font-heading font-bold text-white mb-6 border-b border-white/10 pb-3">
                Get In Touch
              </h3>
            </FadeUp>

            <div className="space-y-6">
              {contactDetails.map((det, i) => {
                const Icon = det.icon;
                return (
                  <FadeUp key={det.label} delay={i * 0.08 + 0.1}>
                    <a
                      href={det.href}
                      target={det.isAddress ? "_blank" : undefined}
                      rel={det.isAddress ? "noopener noreferrer" : undefined}
                      className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-main-500/30 hover:bg-white/[0.07] transition-all duration-300 group block cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-main-500/10 border border-main-500/20 flex items-center justify-center text-main-300 group-hover:bg-main-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] tracking-widest text-main-300 uppercase mb-1">
                          {det.label}
                        </p>
                        <p className="font-sans text-sm text-white group-hover:text-main-300 transition-colors whitespace-pre-line leading-relaxed">
                          {det.value}
                        </p>
                      </div>
                    </a>
                  </FadeUp>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
