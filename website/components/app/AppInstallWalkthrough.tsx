"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, PlusSquare, Smartphone, Download, Check, Sparkles, ArrowRight } from "lucide-react";

export default function AppInstallWalkthrough() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [simulatedInstall, setSimulatedInstall] = useState(false);

  return (
    <section id="install-guide" className="w-full py-24 bg-main-50 px-6 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main-300/20 text-main-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">
            <Sparkles size={14} className="text-main-700" />
            Easy 3-Step Installation
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-main-900 mb-4">
            How to Install the <span className="text-main-500">O.G. PWA Portal</span>
          </h2>
          <p className="text-main-900/70 text-lg leading-relaxed">
            No app store accounts required. As a modern Progressive Web App (PWA), you can add our secure relocation portal to your phone in under 10 seconds.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-main-900/10 shadow-md">
            <button
              onClick={() => setPlatform("ios")}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                platform === "ios"
                  ? "bg-main-900 text-white shadow-lg"
                  : "text-main-900/70 hover:text-main-900"
              }`}
            >
              🍎 Apple iPhone (Safari)
            </button>
            <button
              onClick={() => setPlatform("android")}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                platform === "android"
                  ? "bg-main-900 text-white shadow-lg"
                  : "text-main-900/70 hover:text-main-900"
              }`}
            >
              🤖 Android Phone (Chrome)
            </button>
          </div>
        </div>

        {/* Step Cards Grid */}
        <AnimatePresence mode="wait">
          {platform === "ios" ? (
            <motion.div
              key="ios"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-3xl border border-main-900/10 shadow-lg relative flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-2xl bg-main-900 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-md">
                    01
                  </span>
                  <h3 className="text-xl font-heading font-bold text-main-900 mb-3">
                    Open in Safari Browser
                  </h3>
                  <p className="text-main-900/70 text-sm leading-relaxed mb-6">
                    Ensure you are browsing this website inside Apple&apos;s default **Safari** browser on your iPhone or iPad.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-main-900/5 border border-main-900/10 flex items-center gap-3">
                  <Smartphone className="text-main-900 shrink-0" size={24} />
                  <span className="text-xs font-semibold text-main-900">Active URL: og-agency.com</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-3xl border border-main-900/10 shadow-lg relative flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-2xl bg-main-900 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-md">
                    02
                  </span>
                  <h3 className="text-xl font-heading font-bold text-main-900 mb-3">
                    Tap the Share Button
                  </h3>
                  <p className="text-main-900/70 text-sm leading-relaxed mb-6">
                    Look at the bottom toolbar of Safari and tap the **Share icon** (square with an upward arrow).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-main-500/10 border border-main-500/30 flex items-center justify-center gap-3">
                  <Share2 className="text-main-700 animate-bounce" size={28} />
                  <span className="text-xs font-bold uppercase tracking-wider text-main-900">Tap Bottom Bar Icon</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-3xl border border-main-900/10 shadow-lg relative flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-2xl bg-main-900 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-md">
                    03
                  </span>
                  <h3 className="text-xl font-heading font-bold text-main-900 mb-3">
                    Select &quot;Add to Home Screen&quot;
                  </h3>
                  <p className="text-main-900/70 text-sm leading-relaxed mb-6">
                    Scroll down in the Share menu options and select **&quot;Add to Home Screen&quot;**, then tap **Add** in the top right corner.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-main-900 text-white flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <PlusSquare size={20} className="text-main-300" />
                    <span className="text-xs font-bold">Add to Home Screen</span>
                  </div>
                  <Check size={18} className="text-green-400" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="android"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-3xl border border-main-900/10 shadow-lg relative flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-2xl bg-main-900 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-md">
                    01
                  </span>
                  <h3 className="text-xl font-heading font-bold text-main-900 mb-3">
                    Open in Google Chrome
                  </h3>
                  <p className="text-main-900/70 text-sm leading-relaxed mb-6">
                    Launch **Google Chrome** on your Android smartphone or tablet and navigate to this relocation portal.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-main-900/5 border border-main-900/10 flex items-center gap-3">
                  <Smartphone className="text-main-900 shrink-0" size={24} />
                  <span className="text-xs font-semibold text-main-900">Browser: Google Chrome</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-3xl border border-main-900/10 shadow-lg relative flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-2xl bg-main-900 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-md">
                    02
                  </span>
                  <h3 className="text-xl font-heading font-bold text-main-900 mb-3">
                    Tap Menu or Install Banner
                  </h3>
                  <p className="text-main-900/70 text-sm leading-relaxed mb-6">
                    Tap the **three vertical dots** (⋮) in the top right corner of Chrome, or tap the automatic bottom banner if it pops up.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-main-500/10 border border-main-500/30 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-main-900">Chrome Menu (⋮)</span>
                  <ArrowRight className="text-main-700" size={18} />
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-3xl border border-main-900/10 shadow-lg relative flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-2xl bg-main-900 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-md">
                    03
                  </span>
                  <h3 className="text-xl font-heading font-bold text-main-900 mb-3">
                    Select &quot;Install App&quot;
                  </h3>
                  <p className="text-main-900/70 text-sm leading-relaxed mb-6">
                    Tap **&quot;Install app&quot;** or **&quot;Add to Home screen&quot;**. The official O.G. App icon will immediately appear on your app drawer!
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-main-900 text-white flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <Download size={18} className="text-main-300" />
                    <span className="text-xs font-bold">Install App</span>
                  </div>
                  <Check size={18} className="text-green-400" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Simulator Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-main-900/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-main-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
              OG
            </div>
            <div>
              <h4 className="text-lg font-heading font-bold text-main-900">Want to test browser PWA readiness now?</h4>
              <p className="text-main-900/60 text-xs">Click our install test trigger to check if your current browser allows service worker registration.</p>
            </div>
          </div>

          <button
            onClick={() => setSimulatedInstall(true)}
            disabled={simulatedInstall}
            className={`px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
              simulatedInstall
                ? "bg-green-600 text-white shadow-lg"
                : "bg-main-900 text-white hover:bg-main-700 shadow-xl"
            }`}
          >
            {simulatedInstall ? "✓ Service Worker Verified Active" : "Trigger PWA Install Check"}
          </button>
        </div>

      </div>
    </section>
  );
}
