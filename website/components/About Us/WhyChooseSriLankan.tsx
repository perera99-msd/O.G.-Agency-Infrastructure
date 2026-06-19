"use client";

import { motion } from "framer-motion";
import { Smile, Sparkles, Zap, Award } from "lucide-react";

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

export default function WhyChooseSriLankan() {
  const benefits = [
    {
      icon: Zap,
      title: "Hardworking & Efficient",
      description: "Sri Lankan personnel are recognized internationally for their dedication, efficiency, and high standard of performance.",
    },
    {
      icon: Smile,
      title: "Loyal & Trustworthy",
      description: "A cultural foundation of respect and integrity makes Sri Lankan workers highly loyal and responsible to management.",
    },
    {
      icon: Sparkles,
      title: "High Adaptability",
      description: "Proven capacity to quickly adapt to diverse working conditions, climates, and international environments.",
    },
    {
      icon: Award,
      title: "Highly Skilled & Work-Oriented",
      description: "Fully trained, intelligent candidates who prioritize continuous skill development and career objectives.",
    },
  ];

  return (
    <section className="py-24 bg-white px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Layout: Left/Right Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Stats & Literacy Rate Callout */}
          <div className="lg:col-span-5 space-y-6">
            <FadeUp>
              <p className="font-mono text-xs tracking-[0.2em] text-main-500 uppercase font-semibold">
                Strategic Advantage
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-main-900 leading-tight">
                Why Choose Sri Lankan Manpower?
              </h2>
              <p className="text-secondary-700 font-sans text-sm md:text-base leading-relaxed mt-4">
                Sri Lanka offers a highly literate, skilled, and adaptable talent pool that consistently meets the stringent quality requirements of international businesses.
              </p>
            </FadeUp>

            {/* Huge Stat Card */}
            <FadeUp delay={0.1}>
              <div className="bg-gradient-to-br from-main-500 to-main-700 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-main-500/10">
                {/* Visual decoration */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                
                <p className="text-[10px] font-mono tracking-widest text-main-300 font-bold uppercase mb-2">
                  Key Metric
                </p>
                <p className="text-6xl md:text-7xl font-heading font-extrabold tracking-tight mb-2">
                  91.2%
                </p>
                <p className="text-sm font-semibold font-heading text-white mb-1">
                  National Literacy Rate
                </p>
                <p className="text-xs text-main-50/90 font-sans leading-relaxed">
                  One of the highest literacy rates in Asian nations, reflecting highly intelligent and train-ready candidates.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right Column: Key Benefits */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:mt-8">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <FadeUp key={b.title} delay={i * 0.08 + 0.1}>
                  <div className="h-full bg-main-50/50 border border-secondary-100 hover:border-main-500/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-main-500/5">
                    <div className="w-10 h-10 rounded-lg bg-main-500/10 flex items-center justify-center mb-4 text-main-500">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-base font-heading font-bold text-main-900 mb-2">
                      {b.title}
                    </h4>
                    <p className="text-secondary-700 font-sans text-xs md:text-sm leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
