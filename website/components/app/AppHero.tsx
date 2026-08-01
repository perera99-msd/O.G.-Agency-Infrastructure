"use client";

import { motion } from "framer-motion";
import { Smartphone, ShieldCheck, Download, ArrowDown, Sparkles, CheckCircle2, Lock, Zap, Award } from "lucide-react";
import Image from "next/image";

const premiumEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AppHero() {
  return (
    <section data-nav-theme="light" className="relative w-full min-h-[92vh] bg-white text-main-900 flex items-center justify-center pt-36 pb-20 px-6 lg:px-16 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 -right-20 w-[800px] h-[800px] bg-main-300/30 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[-10%] -left-20 w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-[450px] h-[450px] bg-cyan-300/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05] pointer-events-none" />

      <div className="max-w-[1550px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Floating Glass Container */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: premiumEasing }}
            className="lg:col-span-7 flex flex-col justify-center p-10 sm:p-14 rounded-[40px] bg-white/60 border border-gray-200 backdrop-blur-3xl shadow-xl relative overflow-hidden"
          >
            {/* Inner Glass Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-8 relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-main-100 border border-main-200 text-main-800 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                <Sparkles size={14} className="text-main-600 animate-pulse" />
                Next-Gen PWA
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/50 border border-gray-200 text-gray-800 text-xs font-semibold backdrop-blur-md">
                <Award size={13} className="text-yellow-500" />
                SLBFE Approved
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-black text-main-900 tracking-tight leading-[1.1] mb-8 relative z-10 drop-shadow-sm">
              Your Migration. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-main-900 via-main-700 to-main-500">
                Always in Pocket.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg sm:text-xl font-medium leading-relaxed mb-10 max-w-2xl relative z-10">
              Install the official O.G. Relocation App directly on your smartphone home screen. Track visa milestones in real time, view cryptographically signed contracts, and receive instant updates—with zero app store fees.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-5 relative z-10">
              <a
                href="#install-guide"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-main-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-main-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Download size={18} className="font-bold text-white" />
                Install Web App
                <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-1 text-white" />
              </a>
              <a
                href="#app-features"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-gray-200 text-main-900 font-bold text-sm uppercase tracking-wider hover:bg-gray-50 transition-all duration-300 backdrop-blur-md"
              >
                Explore Features
              </a>
            </div>

            {/* Quick Metrics Bar (Glassy) */}
            <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-3 gap-6 max-w-lg relative z-10">
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-main-900">10k+</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-main-900">99.9%</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Uptime</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-main-900">0%</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Store Fees</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Generated 3D iPhone Mockup Display */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: premiumEasing }}
            className="lg:col-span-5 flex justify-center relative"
          >
            {/* Large Glass Backdrop for the Phone */}
            <div className="absolute inset-0 bg-main-400/20 blur-3xl rounded-full scale-150" />
            
            <div className="relative w-full max-w-[420px] aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[40px] overflow-hidden border border-gray-200 shadow-2xl bg-white/40 backdrop-blur-sm group z-10">
              
              {/* Generated Realistic iPhone & App Mockup */}
              <div className="relative w-full h-full p-2">
                <div className="relative w-full h-full rounded-[32px] overflow-hidden">
                  <Image
                    src="/images/app/hero-mockup.png"
                    alt="O.G. Relocation PWA Portal Mockup"
                    fill
                    priority
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-80" />
                </div>
              </div>

              {/* Floating Glass Status Overlay Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: premiumEasing }}
                className="absolute top-8 left-8 right-8 p-5 rounded-3xl bg-white/80 border border-gray-200 backdrop-blur-2xl shadow-xl z-20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-main-500 animate-ping" />
                    <span className="text-xs font-bold text-main-900 tracking-wide uppercase">Live Progress</span>
                  </div>
                  <span className="text-[10px] font-black text-main-700 bg-main-100 px-3 py-1 rounded-full border border-main-200">
                    80% COMPLETE
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="w-4/5 bg-gradient-to-r from-main-500 to-main-300 h-full rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Stage: <strong className="text-main-900">Work Permit</strong></span>
                  <span className="text-main-600 font-bold">Verified ✓</span>
                </div>
              </motion.div>

              {/* Bottom Floating Security Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, ease: premiumEasing }}
                className="absolute bottom-8 left-8 right-8 p-4 rounded-3xl bg-white/90 text-main-900 backdrop-blur-2xl shadow-xl flex items-center justify-between z-20 border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-main-50 flex items-center justify-center shrink-0 border border-gray-100">
                    <Lock size={20} className="text-main-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-main-900 leading-tight">Blockchain Vault</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Immutable Contract</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
