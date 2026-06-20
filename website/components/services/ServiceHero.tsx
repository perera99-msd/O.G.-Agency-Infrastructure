"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2 } from "lucide-react";

export default function ServiceHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-main-900 via-main-700 to-secondary-900 text-main-50 py-24 md:py-32 px-6">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-main-300/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary-300/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-main-500/10 border border-main-300/30 backdrop-blur-md text-main-300 font-mono text-sm tracking-wide mb-8 shadow-glow-blue"
          >
            <Building2 className="w-4 h-4" />
            <span>ENTERPRISE WORKFORCE SOLUTIONS</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 font-heading text-main-50 leading-[1.1]"
          >
            Scale Your Business with{" "}
            <span className="bg-gradient-to-r from-main-300 to-secondary-300 bg-clip-text text-transparent">
              Global Sourcing
            </span>{" "}
            & Digital Compliance
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-secondary-100 max-w-2xl mb-12 font-sans font-light leading-relaxed"
          >
            End-to-end recruitment, automated visa processing, and secure blockchain verification tailored for enterprise teams. Secure your international talent pipeline.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto"
          >
            <a href="#partner-form" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(0, 168, 232, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-gradient-to-r from-main-300 to-main-500 text-main-900 font-semibold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Partner with Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </a>

            <a href="#calculator" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-transparent border border-main-300/40 text-main-50 font-medium px-8 py-4 rounded-xl hover:border-main-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Estimate Sourcing Costs
              </motion.button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
