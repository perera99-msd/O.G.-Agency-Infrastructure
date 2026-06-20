"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Clock, Globe2 } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const visaRates = [
  { country: "Romania 🇷🇴", percentage: 97, color: "#00a8e8" },
  { country: "Russia 🇷🇺", percentage: 94, color: "#84a98c" },
  { country: "Middle East", percentage: 98, color: "#007ea7" },
  { country: "Europe (Other)", percentage: 91, color: "#52796f" },
];

const bigStats = [
  { value: "2,751+", label: "Total Placements", sub: "Since 2012", icon: Globe2 },
  { value: "98%", label: "Visa Success Rate", sub: "Industry leading", icon: Award },
  { value: "12+", label: "Years Experience", sub: "Founded 2012", icon: TrendingUp },
  { value: "24hrs", label: "Processing Start", sub: "After document submission", icon: Clock },
];

export default function Stats() {
  return (
    <section className="w-full bg-main-900 py-24 px-6 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,168,232,0.1)_0%,transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(82,121,111,0.08)_0%,transparent_55%)] pointer-events-none" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6">
            <Award size={14} className="text-main-300" />
            <span className="text-[11px] font-bold text-main-300 tracking-[0.22em] uppercase">Proven Results</span>
          </div>
          <h2 className="text-white font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-[0.97] tracking-tight mb-5">
            Numbers That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-main-300 to-secondary-300">
              Speak for Us.
            </span>
          </h2>
          <p className="text-white/50 text-base lg:text-lg font-medium max-w-xl mx-auto m-0">
            Over a decade of trusted garment industry placements in Romania, Russia and beyond.
          </p>
        </motion.div>

        {/* BIG STATS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {bigStats.map(({ value, label, sub, icon: Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              whileHover={{ y: -5 }}
              className="bg-white/6 border border-white/10 rounded-2xl p-7 text-center hover:bg-white/10 transition-all duration-300 cursor-default group"
            >
              <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-main-300/20 transition-colors duration-300">
                <Icon size={18} className="text-main-300" />
              </div>
              <div className="font-heading font-black text-3xl lg:text-4xl text-white leading-none mb-2">{value}</div>
              <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{label}</div>
              <div className="text-white/35 text-[10px] font-medium">{sub}</div>
            </motion.div>
          ))}
        </div>

        {/* VISA SUCCESS RATES + COUNTRY HIGHLIGHT */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Visa bar chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="bg-white/6 border border-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp size={18} className="text-main-300" />
              <h4 className="text-white font-heading font-bold text-xl m-0">Visa Approval Rates</h4>
            </div>

            <div className="flex flex-col gap-6">
              {visaRates.map((rate, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-white/80 font-semibold">{rate.country}</span>
                    <span className="font-heading font-black text-white">{rate.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${rate.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: rate.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Two country cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-col gap-5"
          >
            {[
              {
                flag: "🇷🇴", country: "Romania", region: "EU · Eastern Europe",
                metrics: [
                  { label: "Active Placements", value: "900+" },
                  { label: "Avg. Monthly Wage", value: "€850" },
                  { label: "Visa Approval", value: "97%" },
                ],
                accent: "#00a8e8",
                img: "/home/bucharest_romania.jpg",
              },
              {
                flag: "🇷🇺", country: "Russia", region: "Eurasia · High Growth",
                metrics: [
                  { label: "Active Placements", value: "600+" },
                  { label: "Avg. Monthly Wage", value: "$950" },
                  { label: "Visa Approval", value: "94%" },
                ],
                accent: "#84a98c",
                img: "/home/moscow_russia.jpg",
              },
            ].map((item, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden h-40 group cursor-default">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt={item.country} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-main-900/95 via-main-900/70 to-main-900/20" />
                <div className="absolute inset-0 flex items-center px-6 gap-6">
                  <div className="flex-shrink-0">
                    <div className="text-4xl mb-0.5">{item.flag}</div>
                    <div className="text-white font-black text-base leading-none">{item.country}</div>
                    <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">{item.region}</div>
                  </div>
                  <div className="flex gap-5 ml-auto">
                    {item.metrics.map((m, j) => (
                      <div key={j} className="text-center">
                        <div className="font-heading font-black text-xl text-white leading-none">{m.value}</div>
                        <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}