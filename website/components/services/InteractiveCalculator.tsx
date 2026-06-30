// components/services/InteractiveCalculator.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, ShieldAlert, Award, Calendar, CheckSquare, Sparkles } from "lucide-react";

export default function InteractiveCalculator() {
  const [candidates, setCandidates] = useState(5);
  const [industry, setIndustry] = useState("Hospitality");
  const [useVerification, setUseVerification] = useState(true);
  const [useFastTrack, setUseFastTrack] = useState(false);

  const industries = [
    { name: "Hospitality", baseDays: 45, complexity: "Medium" },
    { name: "IT & Engineering", baseDays: 60, complexity: "High" },
    { name: "Healthcare", baseDays: 75, complexity: "Critical" },
    { name: "Construction & Engineering", baseDays: 50, complexity: "Medium-High" },
    { name: "Agriculture", baseDays: 35, complexity: "Low" },
  ];

  const calculation = useMemo(() => {
    const selectedInd = industries.find((i) => i.name === industry) || industries[0];
    let days = selectedInd.baseDays;

    // Scaling factor for number of candidates
    if (candidates > 10) {
      days += Math.floor((candidates - 10) * 0.4);
    }

    // Applying modifier options
    if (useVerification) {
      days -= 10; // credential verification saves time
    }
    if (useFastTrack) {
      days -= 15; // expedited visa processing
    }

    const totalDays = Math.max(days, 25);
    const weeks = Math.ceil(totalDays / 7);

    return {
      days: totalDays,
      weeks,
      complexity: selectedInd.complexity,
    };
  }, [candidates, industry, useVerification, useFastTrack]);

  return (
    <section className="py-24 px-6 bg-main-700 text-main-50 relative overflow-hidden" id="calculator">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-main-300/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading text-main-50">
            Estimate Your Hiring Timeline
          </h2>
          <p className="text-lg text-secondary-100 max-w-prose mx-auto">
            Tell us how many people you need, your industry, and any extra help we'll show you how long it will take.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-stretch">
          {/* Controls Box */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-lg border border-main-500/20 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              {/* Slider Input */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold font-mono tracking-wider text-main-300 uppercase">
                    Number of Candidates
                  </label>
                  <span className="text-2xl font-bold font-mono text-main-300">
                    {candidates}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={candidates}
                  onChange={(e) => setCandidates(parseInt(e.target.value))}
                  className="w-full h-2 bg-main-900 rounded-lg appearance-none cursor-pointer accent-main-300"
                />
                <div className="flex justify-between text-xs text-secondary-300 mt-2 font-mono">
                  <span>1 person</span>
                  <span>100 people</span>
                </div>
              </div>

              {/* Industry Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold font-mono tracking-wider text-main-300 uppercase mb-4">
                  Your Industry
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {industries.map((ind) => (
                    <button
                      key={ind.name}
                      onClick={() => setIndustry(ind.name)}
                      className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                        industry === ind.name
                          ? "bg-main-500 border-main-300 text-main-50 shadow-glow-blue"
                          : "bg-transparent border-main-500/30 text-secondary-100 hover:border-main-300 hover:text-main-50"
                      }`}
                    >
                      {ind.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add‑ons */}
              <div>
                <label className="block text-sm font-semibold font-mono tracking-wider text-main-300 uppercase mb-4">
                  Optional Extras
                </label>
                <div className="flex flex-col gap-4">
                  {/* Credential Verification */}
                  <label className="flex items-start gap-4 p-4 rounded-xl border border-main-500/20 bg-main-900/20 hover:border-main-300/50 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useVerification}
                      onChange={(e) => setUseVerification(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-main-300 cursor-pointer rounded"
                    />
                    <div>
                      <span className="block text-sm font-medium text-main-50 font-heading">
                        Credential Verification (saves ~10 days)
                      </span>
                      <span className="block text-xs text-secondary-300 mt-1">
                        We verify education and work history so you don't have to.
                      </span>
                    </div>
                  </label>

                  {/* Expedited Visa Processing */}
                  <label className="flex items-start gap-4 p-4 rounded-xl border border-main-500/20 bg-main-900/20 hover:border-main-300/50 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useFastTrack}
                      onChange={(e) => setUseFastTrack(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-main-300 cursor-pointer rounded"
                    />
                    <div>
                      <span className="block text-sm font-medium text-main-50 font-heading">
                        Expedited Visa Processing (saves ~15 days)
                      </span>
                      <span className="block text-xs text-secondary-300 mt-1">
                        Priority appointments and faster approvals to cut waiting time.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Output Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-main-950 to-main-900 border border-main-300/20 rounded-2xl p-8 flex flex-col justify-between shadow-glow-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-main-300/10 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main-300/10 border border-main-300/20 text-main-300 font-mono text-xs mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>YOUR ESTIMATED TIMELINE</span>
              </div>

              <div className="mb-8">
                <span className="text-secondary-300 text-sm block mb-1">Estimated Time to Hire</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-bold font-mono text-main-300 tracking-tight">
                    {calculation.days}
                  </span>
                  <span className="text-2xl text-secondary-100 font-sans">days</span>
                </div>
                <span className="text-sm text-secondary-300 mt-2 block">
                  About <strong className="text-main-300">{calculation.weeks} weeks</strong> from start to finish.
                </span>
                <p className="text-xs text-secondary-400 mt-4 italic">
                  * Based on your inputs. We'll give you a more precise date during consultation.
                </p>
              </div>

              <div className="border-t border-main-500/20 pt-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-300">Industry Complexity</span>
                  <span className={`px-2.5 py-1 rounded font-mono text-xs font-semibold ${
                    calculation.complexity === "Critical"
                      ? "bg-red-500/20 text-red-300"
                      : calculation.complexity === "High"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {calculation.complexity}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-300">Verification Service</span>
                  <span className="text-main-300 font-medium font-mono text-xs">
                    {useVerification ? "Included" : "Not selected"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-300">Visa Processing</span>
                  <span className="text-main-300 font-medium font-mono text-xs">
                    {useFastTrack ? "Expedited" : "Standard"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-main-500/20 pt-6">
              <a href="#partner-form">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-main-300 to-secondary-300 text-main-900 font-semibold py-4 rounded-xl text-center shadow-lg transition-transform cursor-pointer"
                >
                  Get a Custom Quote
                </motion.button>
              </a>
              <span className="block text-center text-xs text-secondary-300 mt-3 font-sans">
                Timelines are estimates and may vary based on consulate processing.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}