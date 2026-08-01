"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, PlusSquare, Smartphone, Download, Check, Sparkles, ArrowRight, Monitor, ExternalLink } from "lucide-react";
import Image from "next/image";

const premiumEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AppInstallWalkthrough() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installStatus, setInstallStatus] = useState<"idle" | "prompted" | "installed" | "unsupported">("idle");

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallStatus("idle");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstallStatus("installed");
      } else {
        setInstallStatus("idle");
      }
      setDeferredPrompt(null);
    } else {
      // If browser doesn't have native beforeinstallprompt (e.g. iOS Safari), trigger visual simulation
      setInstallStatus("prompted");
      setTimeout(() => {
        setInstallStatus("idle");
      }, 4000);
    }
  };

  return (
    <section id="install-guide" className="relative w-full py-28 bg-white px-6 lg:px-16 overflow-hidden border-t border-gray-200">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[180px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-blue-700/10 rounded-full blur-[200px] pointer-events-none -translate-y-1/2" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1550px] mx-auto relative z-10">
        
        {/* Section Title Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: premiumEasing }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-50 border border-gray-200 text-cyan-700 text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-600" />
            Simple 3-Step Setup
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-main-900 mb-6">
            Install the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">O.G. Portal</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            No app store accounts, passwords, or storage clutter required. Add our secure relocation portal to your phone in under 10 seconds.
          </p>
        </motion.div>

        {/* Glass Platform Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: premiumEasing }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex p-2 rounded-3xl bg-white/[0.03] border border-gray-200 backdrop-blur-2xl shadow-xl gap-2">
            <button
              onClick={() => setPlatform("ios")}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-500 ${
                platform === "ios"
                  ? "bg-gray-100 text-main-900 shadow-lg border border-gray-300"
                  : "text-gray-500 hover:text-main-900 hover:bg-gray-50 border border-transparent"
              }`}
            >
              <img src="/App/apple.png" alt="Apple" className="w-5 h-5 object-contain" onError={(e) => { e.currentTarget.src = "/App/apple.svg"; e.currentTarget.onerror = null; }} /> Apple iPhone
            </button>
            <button
              onClick={() => setPlatform("android")}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-500 ${
                platform === "android"
                  ? "bg-gray-100 text-main-900 shadow-lg border border-gray-300"
                  : "text-gray-500 hover:text-main-900 hover:bg-gray-50 border border-transparent"
              }`}
            >
              <img src="/App/android.png" alt="Android" className="w-5 h-5 object-contain" onError={(e) => { e.currentTarget.src = "/App/android.svg"; e.currentTarget.onerror = null; }} /> Android (Chrome)
            </button>
          </div>
        </motion.div>

        {/* Step Cards - Staggered Floating Layout */}
        <AnimatePresence mode="wait">
          {platform === "ios" ? (
            <motion.div
              key="ios"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="space-y-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Step 1 */}
                <motion.div 
                  initial={{ opacity: 0, x: -50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, ease: premiumEasing }}
                  className="bg-white/[0.03] p-10 rounded-[32px] border border-gray-200 backdrop-blur-2xl shadow-2xl flex flex-col justify-between group hover:bg-white/[0.05] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="w-14 h-14 rounded-2xl bg-gray-100 text-main-900 font-heading font-black text-2xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform duration-500">
                        01
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200">
                        Safari Browser
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-main-900 mb-4">Open in Safari</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      Open Apple&apos;s default <strong className="text-main-900">Safari browser</strong> on your iPhone or iPad and navigate to our portal homepage.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4">
                    <Smartphone className="text-cyan-600 shrink-0" size={24} />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-main-900 block truncate">URL: og-agency.com</span>
                      <span className="text-[10px] text-gray-500">Apple Safari Required</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: 0.1, ease: premiumEasing }}
                  className="bg-white/[0.03] p-10 rounded-[32px] border border-gray-200 backdrop-blur-2xl shadow-2xl flex flex-col justify-between group hover:bg-white/[0.05] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="w-14 h-14 rounded-2xl bg-gray-100 text-main-900 font-heading font-black text-2xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform duration-500">
                        02
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200">
                        Bottom Toolbar
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-main-900 mb-4">Tap Share Button</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      Look at the bottom navigation bar in Safari and tap the <strong className="text-main-900">Share icon</strong> (square with an arrow pointing upwards).
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-cyan-900/20 border border-cyan-500/20 flex items-center justify-center gap-3">
                    <Share2 className="text-cyan-600 group-hover:-translate-y-1 transition-transform duration-500" size={24} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">Tap Bottom Share</span>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  initial={{ opacity: 0, x: 50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: 0.2, ease: premiumEasing }}
                  className="bg-white/[0.03] p-10 rounded-[32px] border border-gray-200 backdrop-blur-2xl shadow-2xl flex flex-col justify-between group hover:bg-white/[0.05] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="w-14 h-14 rounded-2xl bg-gray-100 text-main-900 font-heading font-black text-2xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform duration-500">
                        03
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
                        Home Shortcut
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-main-900 mb-4">Add to Home</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      Scroll down in the Safari options list and tap <strong className="text-main-900">&quot;Add to Home Screen&quot;</strong>, then confirm by tapping Add.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-100 border border-gray-300 text-main-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlusSquare size={22} className="text-gray-700" />
                      <span className="text-xs font-bold">Add to Home Screen</span>
                    </div>
                    <Check size={22} className="text-green-600 font-bold" />
                  </div>
                </motion.div>

              </div>

              {/* Floating Glass Image Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: premiumEasing }}
                className="relative w-full rounded-[40px] overflow-hidden border border-gray-200 shadow-2xl bg-white/[0.02] backdrop-blur-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12"
              >
                <div className="lg:w-1/2 relative z-10">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-cyan-500/20">
                    Visual iOS Tutorial Guide
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-heading font-bold text-main-900 mb-6">
                    Exact iOS Safari Menu Location
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    Follow the visual callout on your iPhone. Once installed, the O.G. Relocation app icon will instantly appear alongside your other mobile apps for quick 1-tap access.
                  </p>
                  <ul className="space-y-4 text-sm text-gray-700 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><Check size={12} className="text-cyan-600" /></div> Works on iPhone, iPad, and iPod touch
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><Check size={12} className="text-cyan-600" /></div> Does not expire or require re-installation
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2 w-full flex justify-center relative z-10">
                  <div className="relative w-full max-w-[500px] aspect-[16/10] rounded-3xl overflow-hidden border border-gray-300 shadow-2xl group">
                    <Image
                      src="/images/app/ios-install-guide.png"
                      alt="iOS Safari Installation Step-by-Step Guide"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="android"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="space-y-16"
            >
              {/* Android Step Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Step 1 */}
                <motion.div 
                  initial={{ opacity: 0, x: -50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, ease: premiumEasing }}
                  className="bg-white/[0.03] p-10 rounded-[32px] border border-gray-200 backdrop-blur-2xl shadow-2xl flex flex-col justify-between group hover:bg-white/[0.05] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="w-14 h-14 rounded-2xl bg-gray-100 text-main-900 font-heading font-black text-2xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform duration-500">
                        01
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200">
                        Google Chrome
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-main-900 mb-4">Open in Chrome</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      Launch <strong className="text-main-900">Google Chrome</strong> on your Android smartphone or tablet and navigate to this relocation portal.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4">
                    <Smartphone className="text-cyan-600 shrink-0" size={24} />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-main-900 block truncate">Browser: Google Chrome</span>
                      <span className="text-[10px] text-gray-500">Android & Chromium Supported</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: 0.1, ease: premiumEasing }}
                  className="bg-white/[0.03] p-10 rounded-[32px] border border-gray-200 backdrop-blur-2xl shadow-2xl flex flex-col justify-between group hover:bg-white/[0.05] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="w-14 h-14 rounded-2xl bg-gray-100 text-main-900 font-heading font-black text-2xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform duration-500">
                        02
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200">
                        Menu / Banner
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-main-900 mb-4">Tap Menu (⋮)</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      Tap the <strong className="text-main-900">three vertical dots</strong> (⋮) in the top-right corner of Chrome, or tap the automatic installation banner.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-cyan-900/20 border border-cyan-500/20 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">Chrome Options (⋮)</span>
                    <ArrowRight className="text-cyan-600 group-hover:translate-x-1 transition-transform duration-500" size={22} />
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  initial={{ opacity: 0, x: 50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: 0.2, ease: premiumEasing }}
                  className="bg-white/[0.03] p-10 rounded-[32px] border border-gray-200 backdrop-blur-2xl shadow-2xl flex flex-col justify-between group hover:bg-white/[0.05] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="w-14 h-14 rounded-2xl bg-gray-100 text-main-900 font-heading font-black text-2xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform duration-500">
                        03
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
                        App Installed
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-main-900 mb-4">Select "Install App"</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      Tap <strong className="text-main-900">"Install App"</strong> or <strong className="text-main-900">"Add to Home screen"</strong>. The official app icon will pin to your home screen!
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-100 border border-gray-300 text-main-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Download size={22} className="text-gray-700" />
                      <span className="text-xs font-bold">Install App</span>
                    </div>
                    <Check size={22} className="text-green-600 font-bold" />
                  </div>
                </motion.div>

              </div>

              {/* Floating Glass Image Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: premiumEasing }}
                className="relative w-full rounded-[40px] overflow-hidden border border-gray-200 shadow-2xl bg-white/[0.02] backdrop-blur-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12"
              >
                <div className="lg:w-1/2 relative z-10">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-cyan-500/20">
                    Visual Android Tutorial Guide
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-heading font-bold text-main-900 mb-6">
                    Exact Chrome Menu Location
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    See the exact Chrome menu layout highlighted below. On Android, installing the PWA automatically enables native app drawer integration and push notifications.
                  </p>
                  <ul className="space-y-4 text-sm text-gray-700 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><Check size={12} className="text-cyan-600" /></div> Supports Samsung, Xiaomi, Pixel, & more
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><Check size={12} className="text-cyan-600" /></div> Automatic background updates
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2 w-full flex justify-center relative z-10">
                  <div className="relative w-full max-w-[500px] aspect-[16/10] rounded-3xl overflow-hidden border border-gray-300 shadow-2xl group">
                    <Image
                      src="/images/app/android-install-guide.png"
                      alt="Android Chrome Installation Step-by-Step Guide"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Interactive PWA Trigger Simulator Glass Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, delay: 0.2, ease: premiumEasing }}
          className="mt-16 p-10 lg:p-12 rounded-[40px] bg-white/[0.03] border border-gray-200 shadow-2xl backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
        >
          {/* Inner Glow */}
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-white/[0.02] blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-300 text-main-900 flex items-center justify-center font-bold text-lg shadow-2xl shrink-0">
              OG
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600">Live PWA Detector</span>
              </div>
              <h4 className="text-2xl font-heading font-bold text-main-900 mb-2">Want to trigger installation now?</h4>
              <p className="text-gray-500 text-sm max-w-xl">
                Click below to trigger native browser PWA prompt or verify service worker readiness on your device.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className={`px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.1em] transition-all duration-500 shadow-xl shrink-0 flex items-center gap-3 relative z-10 border ${
              installStatus === "installed"
                ? "bg-green-500/20 text-green-700 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                : installStatus === "prompted"
                ? "bg-cyan-500/20 text-cyan-700 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                : "bg-main-900 text-white border-transparent hover:bg-main-800 hover:shadow-lg hover:-translate-y-1"
            }`}
          >
            {installStatus === "installed" ? (
              <>
                <Check size={18} /> PWA Installed
              </>
            ) : installStatus === "prompted" ? (
              <>
                <Sparkles size={18} /> Safari Guide Active Above ↑
              </>
            ) : (
              <>
                <Download size={18} className="text-white" /> Trigger Native Install
              </>
            )}
          </button>
        </motion.div>

      </div>
    </section>
  );
}
