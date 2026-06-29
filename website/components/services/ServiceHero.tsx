"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2, ShieldCheck, Calendar, Users } from "lucide-react";

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
    <section className="relative w-full h-[100vh] min-h-[600px] flex items-end overflow-hidden bg-main-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
          alt="Global recruitment and workforce solutions"
          className="object-cover object-center w-full h-full scale-105"
          loading="eager"
        />
        {/* Gradient overlay matching AboutHero style */}
        <div className="absolute inset-0 bg-gradient-to-t from-main-900 via-main-900/75 to-main-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pb-20 md:pb-24">
        <div className="max-w-screen-xl mx-auto">
          {/* Signature rule */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-[3px] bg-gradient-to-r from-main-300 to-main-500 mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-main-300 font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-4 font-bold"
          >
            Global Talent Acquisition · Licensed Manpower Consultant
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white tracking-tight leading-[0.95] mb-8"
          >
            Hire Top Talent Worldwide
            <br />
            <span className="bg-gradient-to-r from-main-300 to-secondary-300 bg-clip-text text-transparent">
              Faster & Easier
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-secondary-100/90 font-sans text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
          >
            We connect you with skilled professionals across the globe, handle all the paperwork, and make sure your new hires are ready to work on day one.
          </motion.p>

          {/* Credential Badges — matching AboutHero style */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl pt-8 border-t border-white/10"
          >
            

           
          </motion.div>

          {/* CTAs — positioned below badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-start w-full sm:w-auto mt-10"
          >
            <a href="#partner-form" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(0, 168, 232, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-gradient-to-r from-main-300 to-main-500 text-main-900 font-semibold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </a>

            <a href="#workflow" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-transparent border border-main-300/40 text-main-50 font-medium px-8 py-4 rounded-xl hover:border-main-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                See How It Works
              </motion.button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}