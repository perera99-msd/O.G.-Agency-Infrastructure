"use client";

import { motion } from "framer-motion";
import { Smartphone, ShieldCheck, Download, ArrowDown, Sparkles, CheckCircle2 } from "lucide-react";

export default function AppHero() {
  return (
    <section data-nav-theme="dark" className="relative w-full min-h-[85vh] bg-main-900 text-main-50 flex items-center justify-center pt-32 pb-24 px-6 lg:px-16 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-main-700/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-main-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: App Branding & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-main-500/20 border border-main-500/40 text-main-300 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                <Sparkles size={14} className="text-main-500" />
                Progressive Web App (PWA) Hub
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight leading-[1.1] mb-6">
              Track Your Overseas Visa <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-main-300 to-main-500">
                Anytime, Anywhere.
              </span>
            </h1>

            <p className="text-main-50/80 text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-2xl">
              Install the official O.G. Relocation Portal directly onto your smartphone home screen. Enjoy blockchain-verified document storage, real-time embassy visa tracking, and instant notifications—all without app store fees or delays.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                "Instant Home Screen Installation",
                "Blockchain Immutable Contract Vault",
                "24/7 Real-Time Visa Stage Tracking",
                "Offline Access & Fast Loading"
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-main-500 shrink-0" />
                  <span className="text-sm font-semibold text-white/90">{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#install-guide"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-main-900 font-bold text-xs uppercase tracking-wider hover:bg-main-300 transition-all duration-300 shadow-2xl"
              >
                <Download size={16} className="text-main-900" />
                How to Install PWA App
                <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-1" />
              </a>
              <a
                href="#app-features"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-main-700/30 border border-main-50/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-main-700/50 transition-all duration-300"
              >
                Explore Portal Features
              </a>
            </div>
          </div>

          {/* Right Column: Stunning Interactive Smartphone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[310px] sm:w-[350px] bg-main-900 border-4 border-main-50/20 rounded-[3rem] p-4 shadow-2xl shadow-black/80">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="relative w-full bg-main-800 rounded-[2.3rem] overflow-hidden pt-10 pb-6 px-5 border border-white/10 flex flex-col gap-5">
                {/* Header inside Phone */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-main-500 flex items-center justify-center font-bold text-main-900 text-xs">OG</div>
                    <span className="text-white font-bold text-xs tracking-wider uppercase">Relocation App</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    ONLINE
                  </span>
                </div>

                {/* Candidate Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <img src="/gallery/garment-team-pink.jpg" alt="User" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                    <div>
                      <h4 className="text-white font-bold text-sm">Kasun Perera</h4>
                      <p className="text-main-300 text-[11px]">Industrial Machinists • Romania</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="w-4/5 bg-main-500 h-full rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/70 mt-1.5 font-medium">
                    <span>Visa Stage: Work Permit Issued</span>
                    <span className="text-main-300 font-bold">80%</span>
                  </div>
                </div>

                {/* Notifications & Actions */}
                <div className="flex flex-col gap-2.5">
                  <div className="p-3.5 rounded-xl bg-main-500/10 border border-main-500/30 flex items-center gap-3">
                    <ShieldCheck className="text-main-500 shrink-0" size={20} />
                    <div>
                      <p className="text-white text-xs font-bold">Embassy Attestation Verified</p>
                      <p className="text-white/60 text-[10px]">Contract uploaded to secure ledger.</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-white/80 text-xs font-medium">Medical Clearance</span>
                    <span className="text-green-400 font-bold text-xs">VERIFIED ✓</span>
                  </div>
                </div>

                {/* Mock Add to Home Screen Banner */}
                <div className="mt-2 p-3 rounded-xl bg-white text-main-900 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-main-900" />
                    <span className="text-xs font-bold">Add OG Portal to Home Screen</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-main-900 text-white px-2 py-1 rounded">
                    INSTALL
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
