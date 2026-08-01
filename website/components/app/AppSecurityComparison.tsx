"use client";

import { motion } from "framer-motion";
import { Check, X, Shield, Smartphone, QrCode, Lock, Zap, Sparkles } from "lucide-react";

const premiumEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const COMPARISON_MATRIX = [
  { feature: "App Store or Play Store Account Needed", pwa: false, native: true, web: false },
  { feature: "Instant 1-Tap Home Screen Installation", pwa: true, native: false, web: false },
  { feature: "Ultra-Light Storage Usage (< 2 MB)", pwa: true, native: false, web: true },
  { feature: "24/7 Offline Visa Stage & Ticket Access", pwa: true, native: true, web: false },
  { feature: "Real-Time Lockscreen Push Notifications", pwa: true, native: true, web: false },
  { feature: "Blockchain Cryptographically Signed Contracts", pwa: true, native: false, web: false },
  { feature: "Automatic Updates (No Manual Downloads)", pwa: true, native: false, web: true }
];

export default function AppSecurityComparison() {
  return (
    <section className="relative w-full py-28 bg-white px-6 lg:px-16 border-t border-gray-200 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto relative z-10">
        
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
            Why Choose PWA Technology
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-main-900 mb-6">
            Progressive Web App vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Native Store Apps</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            See how the O.G. Relocation PWA architecture delivers maximum speed, zero store friction, and superior cryptographic security for candidate relocation files.
          </p>
        </motion.div>

        {/* Matrix & QR Code Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Comparison Matrix Glass Table (8 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: premiumEasing }}
            className="lg:col-span-8 bg-white/[0.02] backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-x-auto relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[32px]" />
            <table className="w-full text-left border-collapse min-w-[550px] relative z-10">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-5 font-heading font-bold text-gray-700 text-sm tracking-wide">Capability / Feature</th>
                  <th className="pb-5 text-center font-heading font-black text-cyan-600 text-sm bg-cyan-500/10 px-4 py-3 rounded-t-2xl border-x border-t border-cyan-500/20 backdrop-blur-md">
                    O.G. PWA Portal
                  </th>
                  <th className="pb-5 text-center font-heading font-semibold text-gray-500 text-sm px-4 tracking-wide">
                    Native Store App
                  </th>
                  <th className="pb-5 text-center font-heading font-semibold text-gray-500 text-sm px-4 tracking-wide">
                    Standard Mobile Web
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {COMPARISON_MATRIX.map((row, idx) => (
                  <motion.tr 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: premiumEasing }}
                    className="hover:bg-white/[0.04] transition-colors duration-300"
                  >
                    <td className="py-5 text-xs sm:text-sm font-semibold text-gray-700">
                      {row.feature}
                    </td>
                    
                    {/* PWA */}
                    <td className="py-5 text-center bg-cyan-500/5 px-4 font-bold text-xs border-x border-cyan-500/10">
                      {row.pwa ? (
                        <span className="inline-flex items-center gap-1.5 text-cyan-700 font-bold px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                          <Check size={14} className="text-cyan-600" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-gray-500 font-medium px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
                          <X size={14} /> Not Needed
                        </span>
                      )}
                    </td>

                    {/* Native App */}
                    <td className="py-5 text-center px-4 text-xs">
                      {row.native ? (
                        <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <Check size={14} /> Yes
                        </span>
                      ) : (
                        <span className="text-gray-400 font-semibold flex items-center justify-center gap-1">
                          <X size={14} /> No
                        </span>
                      )}
                    </td>

                    {/* Standard Mobile Web */}
                    <td className="py-5 text-center px-4 text-xs">
                      {row.web ? (
                        <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <Check size={14} /> Yes
                        </span>
                      ) : (
                        <span className="text-gray-400 font-semibold flex items-center justify-center gap-1">
                          <X size={14} /> No
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Desktop QR Code Scanner Card (4 Columns) - Floating 3D */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: premiumEasing }}
            style={{ perspective: 1000 }}
            className="lg:col-span-4"
          >
            <motion.div 
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/[0.03] backdrop-blur-3xl text-main-900 rounded-[32px] p-8 lg:p-10 border border-gray-200 shadow-2xl flex flex-col items-center text-center relative overflow-hidden transform-gpu"
            >
              {/* Inner Glows */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

              <span className="relative z-10 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                Instant Phone Scanner
              </span>

              <h3 className="relative z-10 text-2xl lg:text-3xl font-heading font-black text-main-900 mb-4 leading-tight">
                Scan with Smartphone
              </h3>

              <p className="relative z-10 text-gray-600 text-sm leading-relaxed mb-8 font-medium">
                Browsing on laptop or desktop? Scan this QR code with your mobile camera to instantly open the O.G. PWA Relocation Portal on your phone.
              </p>

              {/* Simulated Clean QR Code Graphic */}
              <div className="relative z-10 p-5 rounded-[24px] bg-gray-50 backdrop-blur-xl border border-gray-200 shadow-2xl mb-8 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-48 h-48 relative bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
                  <QrCode size={140} className="text-[#010a11] group-hover:scale-105 transition-transform duration-500 ease-out" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500 text-[#010a11] font-black text-sm flex items-center justify-center shadow-[0_10px_20px_rgba(6,182,212,0.4)] border-[3px] border-white">
                      OG
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-2 text-cyan-600 text-[11px] font-bold uppercase tracking-[0.15em] bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <Smartphone size={16} /> Ready for iOS & Android
              </div>
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
