"use client";

import { motion } from "framer-motion";
import { Shield, Clock, FileText, Globe2, BellRing, Users, Sparkles, CheckCircle2, Lock, Cpu, ArrowRight } from "lucide-react";
import Image from "next/image";

const premiumEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const APP_FEATURES = [
  {
    icon: Clock,
    title: "24/7 Real-Time Tracking",
    desc: "Track your foreign employment application at every milestone: Medical, Embassy, Police Clearance, and Final Work Permit.",
    tag: "LIVE LEDGER",
    badgeColor: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30"
  },
  {
    icon: Shield,
    title: "Blockchain Vault",
    desc: "Your SLBFE contracts and salary terms are cryptographically signed and stored on decentralized nodes, eliminating alteration.",
    tag: "SECURITY HASH",
    badgeColor: "bg-purple-500/20 text-purple-700 border-purple-500/30"
  },
  {
    icon: FileText,
    title: "AI Document Scanner",
    desc: "Snap copies of your passport and trade test results directly through the app camera with automatic AI OCR reading.",
    tag: "AI OCR SCANNER",
    badgeColor: "bg-blue-500/20 text-blue-700 border-blue-500/30"
  },
  {
    icon: BellRing,
    title: "Instant Push Alerts",
    desc: "Receive push notifications directly on your phone lock screen the moment your airline booking and ticket details are confirmed.",
    tag: "PUSH NOTIFICATIONS",
    badgeColor: "bg-amber-500/20 text-amber-700 border-amber-500/30"
  },
  {
    icon: Globe2,
    title: "Offline Low-Data Mode",
    desc: "Optimized specifically for fast performance. Once loaded, your visa stage, flight ticket, and contract remain accessible offline.",
    tag: "OFFLINE CACHE",
    badgeColor: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
  },
  {
    icon: Users,
    title: "24/7 Agency Chat",
    desc: "Connect directly with our dedicated case officers and factory welfare supervisors without paying international calling rates.",
    tag: "DIRECT LIAISON",
    badgeColor: "bg-pink-500/20 text-pink-700 border-pink-500/30"
  }
];

export default function AppFeatureShowcase() {
  return (
    <section id="app-features" className="relative w-full py-28 bg-white px-6 lg:px-16 border-t border-gray-200 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1550px] mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: premiumEasing }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-50 border border-gray-200 text-cyan-700 text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-600" />
            Next-Gen Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-main-900 mb-6">
            Built For <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Transparency & Speed</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            Why carry paper files or worry about lost documents? The O.G. Relocation App puts your entire migration journey in your pocket securely.
          </p>
        </motion.div>

        {/* Floating Glass Bento Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {APP_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            const isMiddle = idx % 3 === 1;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, x: idx % 3 === 0 ? -30 : idx % 3 === 2 ? 30 : 0 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: idx * 0.1, ease: premiumEasing }}
                className={`group p-8 rounded-[32px] bg-white/[0.03] border border-gray-200 backdrop-blur-2xl flex flex-col justify-between shadow-lg hover:bg-white/[0.06] hover:border-gray-300 transition-all duration-500 relative overflow-hidden ${
                  isMiddle ? "lg:translate-y-8" : ""
                }`}
              >
                {/* Subtle Card Accent Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gray-50 rounded-full blur-[50px] group-hover:bg-cyan-500/10 transition-colors duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 text-main-900 flex items-center justify-center border border-gray-200 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500">
                      <Icon size={26} className="text-main-900" />
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] border backdrop-blur-md ${feat.badgeColor}`}>
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-main-900 mb-4">
                    {feat.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-cyan-600 transition-colors duration-300 relative z-10">
                  <span className="tracking-wider uppercase">Explore</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Large Dual Phone Visual Preview Glass Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: premiumEasing }}
          className="relative w-full rounded-[40px] overflow-hidden bg-white/[0.02] border border-gray-200 backdrop-blur-3xl p-10 lg:p-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-16"
        >
          {/* Inner Glows */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-600/10 to-transparent pointer-events-none blur-2xl" />

          <div className="lg:w-1/2 relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 text-[10px] font-bold uppercase tracking-wider mb-6 border border-cyan-500/20">
              <Cpu size={14} className="text-cyan-600" />
              Unified Candidate Portal
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-main-900 leading-tight mb-6">
              Track Progress & Documents Side-by-Side
            </h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10 font-normal">
              Whether you are applying for factory work in Romania, construction in Bosnia, or agriculture in Poland—the O.G. Relocation PWA Portal delivers complete visibility over every step.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 backdrop-blur-md">
                <div className="text-3xl font-heading font-black text-cyan-600 mb-1">100%</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">SLBFE Compliance</div>
              </div>
              <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 backdrop-blur-md">
                <div className="text-3xl font-heading font-black text-cyan-600 mb-1">Instant</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Notification Sync</div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex justify-center relative z-10">
            <div className="relative w-full max-w-[540px] aspect-[16/10] rounded-[32px] overflow-hidden border border-gray-300 shadow-2xl group bg-gray-50 p-2">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/app/features-preview.png"
                  alt="Dual Phone App Feature Preview"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
