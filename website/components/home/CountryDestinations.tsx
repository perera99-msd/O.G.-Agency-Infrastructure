"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Briefcase, TrendingUp, Building2, Globe2, Clock, Shield } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const countryData = [
  {
    id: "romania",
    name: "Romania",
    flag: "🇷🇴",
    flagImg: "/home/hero2/ro.svg",
    region: "Eastern Europe · EU Member",
    accentColor: "#00a8e8",
    accentDark: "#003459",
    heroCity: "/home/bucharest_romania.jpg",
    parkPhoto: "/home/romania_park.jpg",
    foodPhoto: "/home/romania_food.jpg",
    castlePhoto: "/home/romania_castle.jpg",
    factoryIn: "/home/garment_inside.jpg",
    factoryOut: "/home/garment_outside.jpg",
    headline: "Romania — The Garment Capital of Eastern Europe",
    intro: "Romania is one of Europe's most important garment manufacturing nations. Thanks to EU membership, skilled labour, and competitive costs, global fashion brands like Zara, H&M and Benetton rely heavily on Romanian factories. Sri Lankan textile workers here earn EU-standard wages, enjoy Schengen travel rights, and thrive in one of Europe's most hospitable countries.",
    stats: [
      { value: "€4.5B", label: "Annual Garment Exports" },
      { value: "300K+", label: "Textile Industry Jobs" },
      { value: "€600–€1,200", label: "Monthly Salary" },
      { value: "27 EU", label: "Countries to Travel" },
    ],
    industry: [
      "World-class textile factories equipped with modern machinery",
      "Contracts with EU's top fashion brands — Zara, H&M, Adidas",
      "Strict health & safety standards across all facilities",
      "Workers receive paid annual leave (21 days) + public holidays",
      "Overtime pay and performance bonuses included",
    ],
    cityImages: [
      { src: "/home/bucharest_romania.jpg", caption: "Bucharest City Centre" },
      { src: "/home/romania_park.jpg", caption: "Herastrau Park, Bucharest" },
      { src: "/home/romania_castle.jpg", caption: "Peleș Castle, Sinaia" },
      { src: "/home/romania_food.jpg", caption: "Romanian Cuisine" },
    ],
  },
  {
    id: "russia",
    name: "Russia",
    flag: "🇷🇺",
    flagImg: "/home/hero2/ru.svg",
    region: "Eurasia · Expanding Economy",
    accentColor: "#84a98c",
    accentDark: "#2f3e46",
    heroCity: "/home/moscow_russia.jpg",
    parkPhoto: "/home/russia_city.jpg",
    foodPhoto: "/home/russia_food.jpg",
    castlePhoto: "/home/russia_city.jpg",
    factoryIn: "/home/garment_inside.jpg",
    factoryOut: "/home/garment_outside.jpg",
    headline: "Russia — A Rising Star in Global Textile Manufacturing",
    intro: "Russia's textile and garment sector is undergoing a major expansion, creating tens of thousands of new jobs for skilled foreign workers. With full-board accommodation, high pay, and a culturally rich environment, Sri Lankan garment workers in Russia enjoy a premium standard of living. O.G. Agency manages the entire process from visa to your first working day.",
    stats: [
      { value: "$15B", label: "Textile Industry Size" },
      { value: "50K+", label: "New Jobs Annually" },
      { value: "$700–$1,400", label: "Monthly Salary" },
      { value: "100%", label: "Accommodation Provided" },
    ],
    industry: [
      "Large-scale garment factories in Moscow, St. Petersburg & beyond",
      "Full-board accommodation — meals, utilities, transport included",
      "Strong demand for sewing operators, embroiderers, and finishers",
      "Performance bonuses paid monthly — earn up to 30% extra",
      "Russian language basics training provided before departure",
    ],
    cityImages: [
      { src: "/home/moscow_russia.jpg", caption: "Moscow — The Grand Capital" },
      { src: "/home/russia_city.jpg", caption: "Vibrant Moscow Streets" },
      { src: "/home/russia_food.jpg", caption: "Rich Russian Cuisine" },
      { src: "/home/russia_city.jpg", caption: "City Nightlife & Culture" },
    ],
  },
];

export default function CountryShowcase() {
  const [active, setActive] = useState(0);
  const c = countryData[active];

  return (
    <section className="w-full bg-main-900 overflow-hidden">

      {/* ── SECTION INTRO ── */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,232,0.08)_0%,transparent_70%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-7">
            <Globe2 size={14} className="text-main-300" />
            <span className="text-[11px] font-bold text-main-300 tracking-[0.22em] uppercase">Our Primary Destinations</span>
          </div>
          <h2 className="text-white font-heading font-black text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-[-0.03em] mb-6">
            Romania <span className="text-main-300">&</span> Russia
          </h2>
          <p className="text-white/60 text-base lg:text-lg font-medium leading-relaxed max-w-2xl mx-auto m-0">
            Two powerhouse garment industry destinations where Sri Lankan textile professionals build
            thriving international careers — and extraordinary lives.
          </p>
        </motion.div>
      </div>

      {/* ── FLAG TAB SWITCHER ── */}
      <div className="flex max-w-5xl mx-auto px-6 gap-4 mb-0 justify-center pb-10">
        {countryData.map((country, idx) => (
          <motion.button
            key={country.id}
            onClick={() => setActive(idx)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 max-w-xs flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${
              active === idx
                ? "bg-white/10 border-white/30 backdrop-blur-md"
                : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
            }`}
          >
            <span className="text-4xl">{country.flag}</span>
            <div className="text-left">
              <div className={`font-heading font-black text-xl tracking-tight transition-colors ${active === idx ? "text-white" : "text-white/60"}`}>
                {country.name}
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${active === idx ? "text-main-300" : "text-white/30"}`}>
                {country.region}
              </div>
            </div>
            {active === idx && (
              <div className="ml-auto w-2.5 h-2.5 rounded-full bg-main-300 animate-pulse" />
            )}
          </motion.button>
        ))}
      </div>

      {/* ── COUNTRY CONTENT ── */}
      <div key={c.id} className="max-w-7xl mx-auto px-6 pb-24">

        {/* CITY PHOTO GRID */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10"
        >
          {c.cityImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${i === 0 ? "col-span-2 row-span-2 h-80 lg:h-auto aspect-auto" : "h-[160px]"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <span className="text-white text-[11px] font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">{img.caption}</span>
              </div>
              {/* Country flag badge on first image */}
              {i === 0 && (
                <div className="absolute top-4 left-4">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <div className="text-white font-black text-sm leading-none">{c.name}</div>
                      <div className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-0.5">{c.region}</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* HEADLINE + STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="grid lg:grid-cols-12 gap-8 mb-10"
        >
          <div className="lg:col-span-7">
            <h3 className="text-white font-heading font-black text-2xl lg:text-3xl leading-tight tracking-tight mb-5">
              {c.headline}
            </h3>
            <p className="text-white/60 text-sm lg:text-base font-medium leading-relaxed m-0">
              {c.intro}
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {c.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease }}
                className="bg-white/6 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors duration-300 cursor-default"
              >
                <div className="font-heading font-black text-2xl text-white leading-none mb-1.5">{stat.value}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* GARMENT INDUSTRY SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="grid lg:grid-cols-12 gap-5 mb-5"
        >
          {/* Inside Factory Photo */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-72 lg:h-auto group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.factoryIn} alt="Inside garment factory" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-main-300/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <Building2 size={12} className="text-main-300" />
                </div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Inside the Factory</span>
              </div>
              <div className="text-white font-heading font-bold text-lg leading-tight">
                Modern Production<br />Facilities
              </div>
            </div>
          </div>

          {/* Outside Factory Photo */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden h-60 lg:h-auto group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.factoryOut} alt="Outside garment factory" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-secondary-300/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <Briefcase size={12} className="text-secondary-300" />
                </div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Team & Workplace</span>
              </div>
              <div className="text-white font-heading font-bold text-lg leading-tight">
                Happy Teams,<br />Great Employers
              </div>
            </div>
          </div>

          {/* Industry Benefits */}
          <div className="lg:col-span-3 bg-white/6 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={16} className="text-main-300" />
                <span className="text-white font-bold text-sm">Industry Benefits</span>
              </div>
              <div className="flex flex-col gap-3">
                {c.industry.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-main-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/60 text-xs font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-xs tracking-wide border border-white/15 transition-all duration-300 flex items-center justify-center gap-2">
              View All Jobs <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>

        {/* BOTTOM CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          className="flex flex-wrap items-center justify-between gap-5 bg-white/5 border border-white/10 rounded-2xl px-8 py-6"
        >
          <div className="flex items-center gap-5">
            <span className="text-4xl">{c.flag}</span>
            <div>
              <div className="text-white font-heading font-black text-xl mb-0.5">Ready to Work in {c.name}?</div>
              <div className="text-white/50 text-xs font-medium">O.G. Agency handles visa, documentation & employer matching — completely.</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {[
              { icon: Shield, text: "SLBFE Licensed" },
              { icon: Clock, text: "Fast Processing" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="hidden md:flex items-center gap-2">
                <Icon size={14} className="text-main-300" />
                <span className="text-white/50 text-xs font-semibold">{text}</span>
              </div>
            ))}
            <button className="bg-white text-main-900 px-7 py-3.5 rounded-full font-black text-sm tracking-wide hover:bg-main-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:-translate-y-0.5 hover:shadow-xl">
              Apply Now <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
