"use client";

import { motion } from "framer-motion";
import { Shield, Clock, FileText, Globe2, BellRing, Users, Sparkles } from "lucide-react";

const APP_FEATURES = [
  {
    icon: Clock,
    title: "Real-Time Visa Stage Tracking",
    desc: "Track your foreign employment application at every milestone: Medical Examination, Embassy Interview, Police Clearance, and Final Work Permit.",
    tag: "LIVE LEDGER"
  },
  {
    icon: Shield,
    title: "Blockchain Immutable Contract Vault",
    desc: "Your employment contracts and salary terms are cryptographically signed and stored on decentralized cloud nodes, protecting you from tampering.",
    tag: "SECURITY"
  },
  {
    icon: FileText,
    title: "Encrypted Document Uploads",
    desc: "Snap photos of your passport, vocational certificates, and trade test results directly through the camera interface with automatic OCR reading.",
    tag: "AI OCR"
  },
  {
    icon: BellRing,
    title: "Instant Flight & Departure Alerts",
    desc: "Receive push notifications directly on your phone lock screen the second your airline booking, airport orientation, and ticket details are confirmed.",
    tag: "PUSH ALERTS"
  },
  {
    icon: Globe2,
    title: "Offline Access & Low-Data Mode",
    desc: "Designed specifically for fast performance on mobile data networks. Once loaded, your visa status and employer contact details remain accessible offline.",
    tag: "OPTIMIZED"
  },
  {
    icon: Users,
    title: "Direct 24/7 Agency Liaison Chat",
    desc: "Connect directly with our dedicated case officers and Romanian/Polish factory welfare supervisors without paying international calling rates.",
    tag: "DIRECT CHAT"
  }
];

export default function AppFeatureShowcase() {
  return (
    <section id="app-features" className="w-full py-24 bg-white px-6 lg:px-16 border-t border-main-900/10">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main-300/20 text-main-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">
            <Sparkles size={14} className="text-main-700" />
            Portal Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-main-900 mb-4">
            Built For <span className="text-main-500">Transparancy & Speed</span>
          </h2>
          <p className="text-main-900/70 text-lg leading-relaxed">
            Why carry paper files or worry about missing updates? The O.G. Relocation App puts your entire migration journey in your pocket.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {APP_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-main-50 border border-main-900/10 hover:bg-main-900 hover:text-white transition-all duration-500 flex flex-col justify-between shadow-sm hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-main-700 text-main-900 group-hover:text-main-300 flex items-center justify-center shadow-md transition-colors duration-500">
                      <Icon size={26} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-main-900/10 text-main-900 group-hover:bg-main-500 group-hover:text-main-900 transition-colors">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-main-900 group-hover:text-white transition-colors mb-3">
                    {feat.title}
                  </h3>

                  <p className="text-main-900/70 group-hover:text-white/80 text-sm leading-relaxed transition-colors">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
