"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, ShieldCheck, Calendar } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-end overflow-hidden bg-main-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero-aboutUs-3d.png"
          alt="About OG Agency Hero"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Deep Sea navy gradient overlay */}
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
            Established 2012 · Professional Manpower Consultants
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white tracking-tight leading-[0.95] mb-8"
          >
            Who We Are
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-secondary-100/90 font-sans text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
          >
            OG Agency is a leading Sri Lankan foreign employment supplying and consulting agency, duly registered with the Sri Lanka Bureau of Foreign Employment (SLBFE) under License No. 2751.
          </motion.p>

          {/* Quick Credential Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-3.5 text-white bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-main-500/20 flex items-center justify-center flex-shrink-0 text-main-300">
                <Calendar size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-secondary-300">Founded</p>
                <p className="text-sm font-semibold font-heading text-white">Year 2012</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-white bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-main-500/20 flex items-center justify-center flex-shrink-0 text-main-300">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-secondary-300">Regulated By</p>
                <p className="text-sm font-semibold font-heading text-white">SLBFE Approved</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-white bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-main-500/20 flex items-center justify-center flex-shrink-0 text-main-300">
                <Award size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-secondary-300">License No</p>
                <p className="text-sm font-semibold font-heading text-white">License 2751</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
