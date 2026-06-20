"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Briefcase } from "lucide-react";

const premiumEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const slides = [
  {
    id: 0,
    country: "Romania",
    flag: "🇷🇴",
    region: "Eastern Europe",
    city: "Bucharest",
    tagline: "Your European Garment Career Starts Here",
    headline: ["Work in", "Romania —", "Live the", "European Dream."],
    sub: "EU-standard salaries, Schengen travel rights, modern factory facilities, and employer-provided housing — all arranged by O.G. Agency.",
    bg: "/home/bucharest_romania.jpg",
    overlayFrom: "#003459",
    pill: "🏭 Garment Industry Placements Open",
    cta: "Explore Romania Jobs",
    accent: "#00a8e8",
  },
  {
    id: 1,
    country: "Russia",
    flag: "🇷🇺",
    region: "Eurasia",
    city: "Moscow",
    tagline: "High-Pay Textile Careers in Russia",
    headline: ["Build a", "Life of", "Wealth in", "Russia."],
    sub: "Full-board accommodation, generous salaries, performance bonuses, and a culturally rich experience — fully managed by our expert team.",
    bg: "/home/moscow_russia.jpg",
    overlayFrom: "#2f3e46",
    pill: "💼 Textile & Garment Vacancies Available",
    cta: "Explore Russia Jobs",
    accent: "#84a98c",
  },
  {
    id: 2,
    country: "Romania",
    flag: "🇷🇴",
    region: "Eastern Europe",
    city: "Peleș Castle, Romania",
    tagline: "A Land of History, Beauty & Opportunity",
    headline: ["Experience", "the Beauty", "of a New", "Homeland."],
    sub: "From the breathtaking Carpathian mountains to the vibrant cities — Romania offers a life as rich in culture as it is in career growth.",
    bg: "/home/romania_castle.jpg",
    overlayFrom: "#003459",
    pill: "🌍 14+ Countries. 2,751+ Placements",
    cta: "Start Your Journey",
    accent: "#00a8e8",
  },
  {
    id: 3,
    country: "Russia",
    flag: "🇷🇺",
    region: "Eurasia",
    city: "Moscow",
    tagline: "Explore Vibrant City Life Abroad",
    headline: ["Discover", "the Energy", "of Moscow's", "Streets."],
    sub: "Work hard, live well. Spend your weekends exploring world-class architecture, vibrant markets, and unforgettable street culture.",
    bg: "/home/russia_city.jpg",
    overlayFrom: "#2f3e46",
    pill: "🎉 Life Abroad — More Than Just Work",
    cta: "See Life Abroad",
    accent: "#84a98c",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => { setIsAutoPlaying(false); setCurrent(current === slides.length - 1 ? 0 : current + 1); };
  const prevSlide = () => { setIsAutoPlaying(false); setCurrent(current === 0 ? slides.length - 1 : current - 1); };

  const slide = slides[current];

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-main-900 flex flex-col">

      {/* ── BACKGROUND PHOTO ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.bg} alt={slide.city} className="w-full h-full object-cover" />
          {/* Deep gradient overlay left → transparent */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(105deg, ${slide.overlayFrom}F5 0%, ${slide.overlayFrom}CC 35%, ${slide.overlayFrom}55 65%, transparent 100%)` }} />
          {/* Atmospheric bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00171f]/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── FLOATING COUNTRY FLAG WATERMARK ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`flag-${current}`}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 0.07, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: premiumEasing }}
          className="absolute right-[-5%] top-[10%] text-[28rem] leading-none pointer-events-none z-[1] select-none"
        >
          {slide.flag}
        </motion.div>
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="absolute top-[80px] bottom-[90px] left-0 right-0 z-10 max-w-[1600px] mx-auto px-6 lg:px-20 flex flex-col justify-center">

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.9, ease: premiumEasing }}
            className="max-w-3xl"
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: premiumEasing }}
              className="inline-flex items-center gap-2 mb-7 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-[0.18em] uppercase px-5 py-2.5 rounded-full"
            >
              {slide.pill}
            </motion.div>

            {/* Big headline — stacked lines */}
            <div className="mb-8 space-y-0.5">
              {slide.headline.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: premiumEasing }}
                >
                  <span
                    className="block font-heading font-black leading-[0.92] tracking-[-0.04em] text-white"
                    style={{ fontSize: "clamp(3.2rem, 7vw, 6.5rem)" }}
                  >
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8, ease: premiumEasing }}
              className="text-white/70 text-base lg:text-lg font-medium leading-relaxed max-w-xl m-0 mb-10"
            >
              {slide.sub}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: premiumEasing }}
              className="flex flex-wrap items-center gap-4"
            >
              <button className="bg-white text-main-900 px-9 py-4 rounded-full font-black text-sm tracking-wide hover:bg-main-50 shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3">
                {slide.cta} <ArrowRight size={15} />
              </button>
              <button className="bg-transparent border border-white/30 text-white px-9 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Learn How It Works
              </button>
            </motion.div>

            {/* Location pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex items-center gap-2.5"
            >
              <MapPin size={14} className="text-white/50" />
              <span className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase">{slide.city}</span>
              <span className="text-white/25 mx-2">·</span>
              <Briefcase size={14} className="text-white/50" />
              <span className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase">Garment & Textile</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── BOTTOM BAR: stats + controls ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[90px] z-20 max-w-[1600px] mx-auto px-6 lg:px-20 flex items-center justify-between">

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="hidden md:flex items-center gap-8"
        >
          {[
            { v: "2,751+", l: "Placements" },
            { v: "98%", l: "Visa Success" },
            { v: "12+", l: "Years" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-heading font-black text-white text-xl leading-none">{s.v}</div>
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* Dots + arrows */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
                className={`rounded-full transition-all duration-500 ${current === i ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
          <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-all">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-all">
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── SIDE SLIDE INDICATORS ── */}
      <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 hidden lg:flex">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
            className={`flex items-center gap-2.5 transition-all duration-400 group ${current === i ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
          >
            <span className={`block rounded-full bg-white transition-all duration-400 ${current === i ? "w-8 h-0.5" : "w-3 h-0.5"}`} />
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">{s.country}</span>
          </button>
        ))}
      </div>

    </section>
  );
}