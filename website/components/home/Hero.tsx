"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Zap, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const premiumEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const slides = [
  {
    id: 0,
    type: "minimal",
    title: <>Sri Lanka's Premier <br /><span className="text-main-700">Manpower Experts.</span></>,
    description: "OG Agency (License No. 2751) is a leading recruitment consultant in Sri Lanka, supplying skilled professionals to the world since 2012.",
    image: "/home/Hero Floating Image 01.png",
    bgImage: "/home/Hero Slide 1 BG.jpg",
    floatingCards: [
      { id: "global", icon: Globe, title: "Global Reach", desc: "Placements in Dubai, Romania & beyond.", position: "top-[12%] lg:right-[0%]" },
      { id: "talent", icon: Users, title: "Diverse Talent", desc: "Skilled professionals across 20+ industries.", position: "top-[50%] lg:-left-[22%]" }
    ]
  },
  {
    id: 1,
    type: "split",
    title: <>Bridging Talent With<br />Global Opportunities</>,
    description: <>With a 91.2% literacy rate, our hardworking and well-trained <br className="hidden xl:block" /> Sri Lankan workforce is ready to adapt to any environment.</>,
    image: "/home/Hero_2-removebg-preview.png",
    bgBottomImage: "/home/Hero Slide 2 Image (Bottom Background).jpg",
    floatingCards: []
  },
  {
    id: 2,
    type: "gallery-bottom",
    title: <>Your Trusted Partner in <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-main-900 to-main-500">Global Placements</span></>,
    description: "We supply a skilled workforce for Garment Manufacturing, Construction, Engineering, Healthcare, and Hospitality industries across the globe.",
    image: "",
    bgImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2948&auto=format&fit=crop",
    bgBottomImage: "",
    floatingCards: []
  },
  {
    id: 3,
    type: "three-column",
    title: "Trusted by Top Global Employers",
    description: "We maintain the highest standards of professionalism and ethics. Our devoted teamwork ensures assignments are completed with speed and accuracy.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop",
    bgImage: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2800&auto=format&fit=crop",
    bgBottomImage: "",
    floatingCards: []
  }
];

const countriesList = [
  { name: "Romania", flag: "/home/hero2/ro.svg", desc: "Europe" },
  { name: "Russia", flag: "/home/hero2/ru.svg", desc: "Eurasia" },
  { name: "Qatar", flag: "/home/hero2/qa.svg", desc: "Middle East" },
  { name: "Dubai", flag: "/home/hero2/ae.svg", desc: "UAE" },
  { name: "Poland", flag: "/home/hero2/pl.svg", desc: "Europe" },
  { name: "Saudi Arabia", flag: "/home/hero2/sa.svg", desc: "Middle East" },
  { name: "Oman", flag: "/home/hero2/om.svg", desc: "Middle East" },
  { name: "Azerbaijan", flag: "/home/hero2/az.svg", desc: "Eurasia" },
  { name: "Canada", flag: "/home/hero2/ca.svg", desc: "North America" },
  { name: "Australia", flag: "/home/hero2/au.svg", desc: "Oceania" },
  { name: "Germany", flag: "/home/hero2/de.svg", desc: "Europe" },
  { name: "UK", flag: "/home/hero2/gb.svg", desc: "Europe" },
  { name: "Japan", flag: "/home/hero2/jp.svg", desc: "Asia" },
  { name: "Singapore", flag: "/home/hero2/sg.svg", desc: "Asia" }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 12000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => { setIsAutoPlaying(false); setCurrent(current === slides.length - 1 ? 0 : current + 1); };
  const prevSlide = () => { setIsAutoPlaying(false); setCurrent(current === 0 ? slides.length - 1 : current - 1); };

  return (
    // STRICT BOUNDARY: 100dvh only. No min-height to break taskbars.
    <section className="relative w-full h-[100dvh] flex flex-col justify-center overflow-hidden bg-main-50">

      {/* Dynamic Backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {/* PREVIOUS SLIDE 1 BACKUP: 
              brightness-[0.9], from-main-50/95 via-main-50/80 to-transparent, from-main-50/80 via-transparent 
          */}
          {slides[current].type === "minimal" && (
            <>
              {slides[current].bgImage && (
                <motion.img
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 12, ease: "linear" }}
                  src={slides[current].bgImage}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[1.05]"
                />
              )}
              {/* Clean gradient overlay to keep text legible on the left, fading out to show the image on the right */}
              <div className="absolute inset-0 bg-gradient-to-r from-main-50/95 via-main-50/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-main-50/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9)_0%,transparent_50%)]" />
            </>
          )}

          {slides[current].type === "split" && (
            <div className="absolute inset-0 flex flex-col">
              <div className="h-[50%] bg-gradient-to-br from-main-50 via-main-50 to-main-300/10" />
              <div className="h-[50%] bg-main-900 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slides[current].bgBottomImage} alt="Background" className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-125 saturate-50 opacity-90" />
              </div>
            </div>
          )}

          {slides[current].type === "gallery-bottom" && (
            <div className="absolute inset-0 bg-white">
              <img src={slides[current].bgImage} alt="Global Background" className="w-full h-full object-cover filter brightness-[1.05]" />
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-white/95" />
            </div>
          )}

          {slides[current].type === "three-column" && (
            <div className="absolute inset-0 bg-main-50 overflow-hidden">
              <img src={slides[current].bgImage} alt="Abstract Background" className="absolute inset-0 w-full h-full object-cover filter brightness-[1.1] grayscale-[0.3] opacity-60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/40 to-white/90" />
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-main-300/30 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary-300/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 
        THE MASTER BOUNDING BOX 
        Locks content between Navbar (top 100px) and Controls (bottom 80px)
        It is mathematically impossible to overlap.
      */}
      <div className="absolute top-[100px] bottom-[80px] left-0 right-0 z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >

            {/* ==== LAYOUT 1: MINIMAL ==== */}
            {slides[current].type === "minimal" && (
              <div className="w-full h-full flex flex-col lg:flex-row items-center justify-between overflow-y-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {/* Left Text */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center h-auto lg:h-full z-30 pt-6 lg:pt-0 flex-shrink-0">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: premiumEasing }} className="mb-6 lg:mb-8 mt-4 lg:mt-0">
                    <h1 className="text-main-900 font-heading font-black text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.95] tracking-[-0.04em]">
                      {slides[current].title}
                    </h1>
                  </motion.div>
                  <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: premiumEasing }} className="text-secondary-800 text-sm sm:text-base lg:text-lg max-w-[85%] font-medium leading-relaxed mb-8 lg:mb-10">
                    {slides[current].description}
                  </motion.p>
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: premiumEasing }}>
                    <button className="bg-main-900 text-white px-8 py-3.5 lg:px-10 lg:py-4 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-main-700 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 w-fit">
                      Find Placement <ArrowRight size={14} />
                    </button>
                  </motion.div>
                </div>

                {/* Right Image Container */}
                <div className="w-full lg:w-6/12 h-[45vh] lg:h-full relative flex items-center justify-center z-20 flex-shrink-0 mt-8 lg:mt-0 pb-8 lg:pb-0">
                  {slides[current].image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: 30 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 1.2, delay: 0.3, ease: premiumEasing }}
                      className="relative w-full h-full flex flex-col items-center justify-center isolate [transform:translateZ(0)]"
                    >
                      <img 
                        src={slides[current].image} 
                        alt="Hero Cutout" 
                        className="max-w-[95%] lg:max-w-[105%] max-h-[90%] lg:max-h-[105%]"
                        style={{
                          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                          WebkitMaskComposite: 'source-in',
                          maskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                          maskComposite: 'intersect'
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Floating Cards (VoltPeak style) */}
                  {slides[current].floatingCards?.map((card, idx) => (
                    <motion.div
                      key={`card-${idx}`}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1, delay: 0.7 + idx * 0.2, ease: premiumEasing }}
                      className={`absolute ${card.position} z-30 hidden md:block`}
                    >
                      <div className="relative">
                        <div className="bg-white/40 backdrop-blur-xl p-5 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] border border-white/60 max-w-[260px] hover:-translate-y-1 transition-transform duration-500 cursor-pointer">
                          <h4 className="font-semibold text-main-900 text-sm tracking-tight mb-1.5">{card.title}</h4>
                          <p className="text-[11px] text-secondary-700 font-medium leading-relaxed opacity-90">{card.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Customer Review Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2, ease: premiumEasing }}
                    className="absolute bottom-[5%] right-[5%] z-30 hidden lg:flex flex-col items-end text-right pointer-events-auto"
                  >
                    <div className="flex items-center -space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full border-2 border-main-50 bg-secondary-100 overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="Avatar" /></div>
                      <div className="w-8 h-8 rounded-full border-2 border-main-50 bg-secondary-300/50 overflow-hidden"><img src="https://i.pravatar.cc/100?img=2" alt="Avatar" /></div>
                      <div className="w-8 h-8 rounded-full border-2 border-main-50 bg-secondary-300 overflow-hidden"><img src="https://i.pravatar.cc/100?img=3" alt="Avatar" /></div>
                      <div className="w-8 h-8 rounded-full border-2 border-main-50 bg-main-900 flex items-center justify-center text-white text-[10px] font-bold">+</div>
                    </div>
                    <div className="font-heading font-black text-3xl text-main-900 leading-none tracking-tight">10K+</div>
                    <div className="text-[9px] font-bold text-secondary-600 uppercase tracking-widest mt-1">Customer Reviews</div>
                  </motion.div>

                </div>

              </div>
            )}

            {/* ==== LAYOUT 2: SPLIT SCREEN (Festo Inspired) ==== */}
            {slides[current].type === "split" && (
              <div className="w-full h-full relative z-20">
                {/* Top Half Content */}
                <div className="absolute top-0 left-0 w-full h-[50%] flex items-center justify-between pointer-events-none">

                  {/* Left Column */}
                  <div className="w-full lg:w-[40%] pl-0 lg:pl-10 pr-4 lg:pr-0 pt-0 lg:pt-8 pointer-events-auto">
                    <h1 className="text-main-900 font-heading font-black text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] leading-[1.05] tracking-tighter mb-4 lg:mb-6 mt-10">
                      {slides[current].title}
                    </h1>
                    <p className="text-secondary-600 text-sm max-w-[90%] font-medium leading-relaxed mb-6 lg:mb-8">
                      {slides[current].description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="bg-main-900 text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-main-700 transition-colors shadow-lg hover:shadow-xl">Get Appointment</button>
                      <button className="bg-white border border-main-900/20 text-main-900 px-6 py-3 rounded-full text-xs font-bold hover:bg-main-50 transition-colors shadow-sm">View Success Stories</button>
                      <button className="w-10 h-10 rounded-full border border-main-900/20 bg-white flex items-center justify-center text-main-900 hover:bg-main-50 transition-colors shadow-sm">
                        <ArrowRight size={16} className="-rotate-45" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column (Floating Card) */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: premiumEasing }} className="hidden lg:block w-[30%] pr-10 pointer-events-auto z-40 mt-10">
                    <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] ml-auto w-[280px] border border-secondary-100">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-secondary-800 text-sm font-semibold tracking-wide">Total Placements</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-secondary-300" />
                          <div className="w-1 h-1 rounded-full bg-secondary-300" />
                          <div className="w-1 h-1 rounded-full bg-secondary-300" />
                        </div>
                      </div>
                      <div className="text-main-900 font-heading font-black text-[2.5rem] leading-none tracking-tight mb-8">2,751<span className="text-main-500">+</span></div>
                      <div className="flex items-end justify-between gap-2 h-24">
                        <div className="w-full bg-secondary-100/30 h-[45%] rounded-t-lg transition-all hover:bg-main-300/30" />
                        <div className="w-full bg-secondary-100/60 h-[30%] rounded-t-lg transition-all hover:bg-main-300/60" />
                        <div className="w-full bg-secondary-100 h-[65%] rounded-t-lg transition-all hover:bg-main-300" />
                        <div className="w-full bg-main-500 h-[100%] rounded-t-lg shadow-[0_4px_15px_rgba(var(--main-500),0.4)]" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2, ease: premiumEasing }}
                  className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[100%] lg:w-[75%] xl:w-[65%] h-[85%] z-20 pointer-events-none flex items-end justify-center"
                >
                  <img
                    src={slides[current].image}
                    alt="Hero Cutout"
                    className="h-full max-h-full object-contain object-bottom [mask-image:linear-gradient(to_top,transparent_0%,black_15%)]"
                  />
                </motion.div>

                {/* Bottom Half Content */}
                <div className="absolute bottom-0 left-0 w-full h-[50%] flex flex-col justify-end items-center pb-8 lg:pb-10 pointer-events-none">
                  <div className="relative z-30 text-center pointer-events-auto">
                    <h3 className="text-white font-heading font-bold text-3xl lg:text-4xl mb-5 tracking-wide drop-shadow-lg">
                      Your smart <span className="font-serif italic font-light opacity-90 text-main-50">partner</span>
                    </h3>
                    <div className="flex items-center bg-white rounded-full p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] mx-auto w-fit border border-white/20">
                      <input type="text" placeholder="Your Email" className="bg-transparent text-secondary-900 placeholder:text-secondary-400 text-sm px-6 py-3 outline-none w-56 sm:w-72 font-semibold tracking-wide" />
                      <button className="bg-main-900 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-wider hover:bg-black transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap">Submit</button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ==== LAYOUT 3: GALLERY BOTTOM ==== */}
            {slides[current].type === "gallery-bottom" && (
              <div className="w-full h-full flex flex-col pt-8 pb-4 relative z-30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-shrink-0 flex flex-col items-center text-center z-30 pt-4 lg:pt-8 pb-12 lg:pb-16">
                  <div className="mb-4 lg:mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-main-900/5">
                    <Globe className="text-main-500" size={14} />
                    <span className="text-[9px] lg:text-[10px] font-bold text-main-900 tracking-[0.2em] uppercase">Global Destinations</span>
                  </div>
                  <h1 className="text-main-900 font-heading font-black text-4xl sm:text-5xl lg:text-[5rem] leading-[0.95] tracking-tighter uppercase max-w-5xl mb-4 lg:mb-6 drop-shadow-sm">
                    {slides[current].title}
                  </h1>
                  <p className="text-secondary-700 text-xs lg:text-sm max-w-2xl font-medium leading-relaxed mb-6 lg:mb-8 relative z-40">
                    {slides[current].description}
                  </p>
                  <button className="bg-main-900 text-main-50 px-10 py-4 rounded-full text-[10px] lg:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-main-700 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                    Start Your Journey
                  </button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="flex-1 w-full flex flex-col justify-end z-30 relative mt-8 lg:mt-auto">

                  <div className="relative w-full overflow-hidden pb-12 lg:pb-16 flex flex-col gap-4 lg:gap-5">

                    <motion.div
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
                      className="flex gap-4 lg:gap-5 w-max px-4"
                    >
                      {[...countriesList, ...countriesList].map((country, index) => (
                        <div key={`r1-${index}`} className="flex items-center gap-3 lg:gap-4 w-48 lg:w-56 bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full p-1.5 lg:p-2 pr-4 lg:pr-6 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group flex-shrink-0">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden shadow-inner border border-black/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 relative bg-secondary-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={country.flag} alt={country.name} className="absolute inset-0 w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="font-heading font-black text-main-900 text-[11px] lg:text-sm tracking-wide uppercase">{country.name}</div>
                            <div className="text-[7px] lg:text-[8px] font-bold text-main-900/40 uppercase tracking-widest mt-0.5">{country.desc}</div>
                          </div>
                          <div className="ml-auto opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <ArrowRight size={14} className="text-main-900" />
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    {/* Row 2: Scrolling Right (Staggered) */}
                    <motion.div
                      animate={{ x: ["-50%", "0%"] }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                      className="flex gap-4 lg:gap-5 w-max px-4 ml-12"
                    >
                      {[...countriesList.slice().reverse(), ...countriesList.slice().reverse()].map((country, index) => (
                        <div key={`r2-${index}`} className="flex items-center gap-3 lg:gap-4 w-48 lg:w-56 bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full p-1.5 lg:p-2 pr-4 lg:pr-6 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group flex-shrink-0">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden shadow-inner border border-black/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 relative bg-secondary-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={country.flag} alt={country.name} className="absolute inset-0 w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="font-heading font-black text-main-900 text-[11px] lg:text-sm tracking-wide uppercase">{country.name}</div>
                            <div className="text-[7px] lg:text-[8px] font-bold text-main-900/40 uppercase tracking-widest mt-0.5">{country.desc}</div>
                          </div>
                          <div className="ml-auto opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <ArrowRight size={14} className="text-main-900" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* ==== LAYOUT 4: THREE-COLUMN (Bento Grid Redesign) ==== */}
            {slides[current].type === "three-column" && (
              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-4 lg:gap-6 pt-4 pb-4 lg:pt-8 lg:pb-8 z-30 relative overflow-y-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {/* Hero Text Card */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="col-span-12 lg:col-span-4 row-span-2 bg-white/80 backdrop-blur-3xl rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-main-300/30 to-transparent rounded-bl-full opacity-40 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-main-50 text-main-900 text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
                      <Globe size={14} /> Global Network
                    </div>
                    <h1 className="text-main-900 mb-3 font-heading font-black text-3xl lg:text-4xl xl:text-5xl leading-[1.05] tracking-tight">
                      {slides[current].title}
                    </h1>
                    <p className="text-xs lg:text-sm text-secondary-600 mb-4 max-w-[90%] leading-relaxed font-medium">
                      {slides[current].description}
                    </p>
                    <button className="flex items-center gap-4 bg-main-900 text-white px-8 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-main-700 shadow-lg group-hover:shadow-xl transition-all w-fit">
                      Start Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-main-900/5 relative z-10">
                    <div className="text-2xl font-heading font-black text-main-900 mb-1 tracking-tight">91.2%</div>
                    <p className="text-[10px] text-secondary-500 font-bold uppercase tracking-widest mb-3">
                      Literacy Rate
                    </p>
                    <p className="text-[10px] text-secondary-500 font-medium mb-3 max-w-[90%]">
                      A hardworking, efficient, and intelligent workforce from Sri Lanka.
                    </p>
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-[2px] border-white bg-secondary-100 overflow-hidden shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Main Central Image Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="col-span-12 lg:col-span-5 row-span-2 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.1)] relative group min-h-[40vh] lg:min-h-0">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slides[current].image} alt="Main Placement" className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl text-white flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-white/80 mb-1">Licensed</div>
                        <div className="font-heading font-bold text-lg">SLBFE Approved</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-main-900 shadow-lg">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Top Right Card: Ratings & Awards */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="col-span-12 lg:col-span-3 row-span-1 bg-main-900 rounded-[2rem] p-8 flex flex-col justify-center shadow-[0_15px_40px_rgb(0,0,0,0.15)] relative overflow-hidden group cursor-pointer min-h-[250px] lg:min-h-0">
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-main-500 rounded-full blur-[50px] group-hover:bg-main-300 transition-colors duration-700 opacity-60" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className="text-main-300" fill="currentColor" />
                      ))}
                      <span className="font-black font-heading text-white text-xl ml-2 tracking-wide">4.9/5</span>
                    </div>
                    <div className="text-[10px] text-white/60 mb-6 font-bold uppercase tracking-widest">SLBFE License No.</div>
                    <h3 className="text-xl lg:text-2xl font-heading font-bold text-white leading-tight mb-3">
                      Government<br />Approved
                    </h3>
                    <p className="text-[11px] text-white/70 font-medium leading-relaxed max-w-[90%]">
                      Duly registered under the Sri Lanka Bureau of Foreign Employment (License No. 2751).
                    </p>
                  </div>
                </motion.div>

                {/* Bottom Right Card: Mini Gallery */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="col-span-12 lg:col-span-3 row-span-1 bg-white/80 backdrop-blur-xl rounded-[2rem] p-4 flex gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 min-h-[200px] lg:min-h-0">
                  <div className="w-1/2 h-full rounded-[1.5rem] overflow-hidden relative shadow-inner group cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop" alt="Thumb 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="w-1/2 h-full rounded-[1.5rem] overflow-hidden relative shadow-inner group cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" alt="Thumb 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                </motion.div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* 
        THE CONTROLS BOUNDING BOX
        Absolute bottom exactly 80px high to match boundaries 
      */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] w-full max-w-[1600px] mx-auto px-6 lg:px-16 flex items-center justify-between z-40">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button key={index} onClick={() => { setIsAutoPlaying(false); setCurrent(index); }} className="group relative py-2">
              <div className={`h-1.5 rounded-full transition-all duration-500 ease-out ${current === index ? (slides[current].type === "split" ? "w-10 bg-main-50" : "w-10 bg-main-900") : (slides[current].type === "split" ? "w-4 bg-main-50/40 group-hover:bg-main-50/80" : "w-4 bg-main-900/20 group-hover:bg-main-900/40")}`} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={prevSlide} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors backdrop-blur-md ${slides[current].type === "split" ? "border-main-50/20 text-main-50 hover:bg-main-50 hover:text-main-900" : "border-main-900/10 text-main-900 hover:bg-main-900 hover:text-white"}`}>
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button onClick={nextSlide} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors backdrop-blur-md ${slides[current].type === "split" ? "border-main-50/20 text-main-50 hover:bg-main-50 hover:text-main-900" : "border-main-900/10 text-main-900 hover:bg-main-900 hover:text-white"}`}>
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}