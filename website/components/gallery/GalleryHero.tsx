"use client";

import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Users, CheckCircle2 } from "lucide-react";

export default function GalleryHero() {
  return (
    <section className="relative w-full h-[75vh] min-h-[500px] flex items-end overflow-hidden bg-main-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="Gallery Hero Background"
          className="object-cover object-center w-full h-full scale-105 filter brightness-[0.4]"
        />
        {/* Navy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-main-900 via-main-900/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pb-16 md:pb-20">
        <div className="max-w-[1600px] mx-auto">
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
            Visual Journey · Verification & Excellence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white tracking-tight leading-[0.95] mb-8"
          >
            Our Gallery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-secondary-100/90 font-sans text-lg md:text-xl max-w-2xl leading-relaxed mb-10 font-medium"
          >
            Explore real moments from our recruitment journey: verified placements worldwide, advanced training classrooms, document stamping ceremonies, and visits from overseas clients.
          </motion.p>

          {/* Quick Stats Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-3.5 text-white bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-main-500/20 flex items-center justify-center flex-shrink-0 text-main-300">
                <Users size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-secondary-300">Success Stories</p>
                <p className="text-sm font-semibold font-heading text-white">2,750+ Placements</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-white bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-main-500/20 flex items-center justify-center flex-shrink-0 text-main-300">
                <CheckCircle2 size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-secondary-300">Visa Success</p>
                <p className="text-sm font-semibold font-heading text-white">98% Stamping Rate</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-white bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-main-500/20 flex items-center justify-center flex-shrink-0 text-main-300">
                <Camera size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-secondary-300">Transparency</p>
                <p className="text-sm font-semibold font-heading text-white">100% Real Media</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
