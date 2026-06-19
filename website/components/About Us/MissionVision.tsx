"use client";

import { motion } from "framer-motion";
import { Compass, Target } from "lucide-react";

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

export default function MissionVision() {
  return (
    <section className="py-24 bg-gradient-to-b from-main-900 to-[#000c10] px-6 md:px-12 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-main-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-main-300/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-20">
            <p className="font-mono text-xs tracking-[0.2em] text-main-300 uppercase mb-3 font-semibold">
              Purpose & Focus
            </p>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight max-w-2xl mx-auto">
              Guiding principles behind our success
            </h2>
            <div className="w-12 h-[2px] bg-main-500 mx-auto mt-6" />
          </div>
        </FadeUp>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Mission Card */}
          <FadeUp delay={0.1}>
            <div className="group relative h-full bg-white/[0.05] backdrop-blur-md border border-white/10 hover:border-main-500/30 rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-main-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-main-500/10 border border-main-500/20 flex items-center justify-center mb-8 text-main-300 group-hover:bg-main-500 group-hover:text-white transition-all duration-300">
                  <Target size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-white mb-4">
                  Our Mission
                </h3>
                
                <p className="text-main-50/90 font-sans text-base leading-relaxed flex-grow">
                  To deliver a high level of competency, professionalism, and satisfaction while maintaining industry leadership and building trusted, long-lasting relationships with our clients and employees.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Vision Card */}
          <FadeUp delay={0.2}>
            <div className="group relative h-full bg-white/[0.05] backdrop-blur-md border border-white/10 hover:border-main-500/30 rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-main-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-main-500/10 border border-main-500/20 flex items-center justify-center mb-8 text-main-300 group-hover:bg-main-500 group-hover:text-white transition-all duration-300">
                  <Compass size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-white mb-4">
                  Our Vision
                </h3>
                
                <p className="text-main-50/90 font-sans text-base leading-relaxed flex-grow">
                  To be recognized as one of the top performers among foreign employment services in Sri Lanka by developing and supplying the best-qualified workers to different countries worldwide.
                </p>
              </div>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
}
