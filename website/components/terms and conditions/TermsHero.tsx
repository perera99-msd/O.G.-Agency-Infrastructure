"use client";

import { motion } from "framer-motion";

export default function TermsHero() {
  return (
    <section className="relative w-full h-[55vh] min-h-[420px] flex items-end overflow-hidden bg-main-900">
      {/* Premium Background Design */}
      <div className="absolute inset-0 w-full h-full">
        {/* Sleek mesh/radial background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-main-950 via-main-900 to-main-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,168,232,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,126,167,0.1),transparent_55%)]" />
        
        {/* Subtle decorative vector mesh element */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Elegant light leak highlight */}
        <div className="absolute -top-[20%] left-[10%] w-[60%] h-[50%] bg-main-300/10 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pb-12 md:pb-16">
        <div className="max-w-screen-xl mx-auto">
          {/* Signature horizontal accent rule */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-[2px] bg-main-300 mb-6"
          />

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-main-300 font-mono text-xs tracking-[0.3em] uppercase mb-4"
          >
            Legal & Compliance
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-main-50 tracking-tight leading-[1.05] mb-6"
          >
            Terms of Service
          </motion.h1>

          {/* Description / Introduction */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-secondary-100/70 font-sans text-sm md:text-base max-w-xl leading-relaxed"
          >
            Please read these terms and conditions carefully. By utilizing the O.G. Agency recruitment portal, international career services, or digital recruitment platforms, you agree to these legal obligations.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
