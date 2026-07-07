"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEOS = [
  {
    id: "romania",
    country: "ROMANIA",
    label: "Europe",
    title: "Romania",
    videoUrl: "/home/Video/romania-opt.mp4",
    posterImage: "/images/destinations/sky.png",
    credits: "",
    duration: 15,
  },
  {
    id: "bosnia",
    country: "BOSNIA",
    label: "Europe",
    title: "Bosnia",
    videoUrl: "/home/Video/bosnia-opt.mp4",
    posterImage: "/images/destinations/sky.png",
    credits: "",
    duration: 15,
  },
  {
    id: "russia",
    country: "RUSSIA",
    label: "Eurasia",
    title: "Russia",
    videoUrl: "/home/Video/russia-opt.mp4",
    posterImage: "/images/destinations/sky.png",
    credits: "",
    duration: 16,
  },
];

export default function VideoShowcase() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showName, setShowName] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nameTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show center name for 1st 3.5 seconds on slide change, then hide to reveal full video
  useEffect(() => {
    setShowName(true);
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    nameTimerRef.current = setTimeout(() => {
      setShowName(false);
    }, 3500);

    return () => {
      if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    };
  }, [currentIdx]);

  // Auto advance slide every 60 seconds
  useEffect(() => {
    if (!mounted) return;

    timerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % VIDEOS.length);
    }, VIDEOS[currentIdx].duration * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, mounted]);

  const currentSlide = VIDEOS[currentIdx];

  return (
    <section data-nav-theme="dark" className="relative w-full h-[85vh] md:h-screen min-h-[600px] overflow-hidden bg-black select-none">
      {/* === LAYER 1: FULL SCREEN WALL-TO-WALL VIDEO === */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            {/* Fallback poster while video iframe initializes */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.posterImage})` }}
            />

            {/* Optimized Fast-Loading Local Video */}
            {mounted && (
              <video
                key={currentSlide.id}
                src={currentSlide.videoUrl}
                poster={currentSlide.posterImage}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onCanPlay={(e) => {
                  e.currentTarget.play().catch(() => {});
                }}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* === TOP SEAMLESS CINEMATIC BLEND === */}
      <div className="absolute top-0 left-0 right-0 h-24 z-[1] pointer-events-none bg-white/5 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]" />

      {/* === LAYER 2: MASSIVE CENTER COUNTRY NAME (Pops up in 1st 1-4 secs, then hides) === */}
      <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none px-6">
        <AnimatePresence>
          {showName && (
            <motion.span
              key={currentSlide.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 0.75, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-full text-center break-words"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(44px, 13.5vw, 180px)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.04em",
                lineHeight: 1,
                userSelect: "none",
                textShadow: "0 10px 40px rgba(0,0,0,0.8)",
              }}
            >
              {currentSlide.country}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* === LAYER 3: SUBTLE BOTTOM GRADIENT === */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none px-10 pb-10 pt-32"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
      />

      {/* === LAYER 4: BOTTOM INFO & DOTS (Mirroring Destinations Page) === */}
      <div className="absolute bottom-10 left-10 right-10 z-[4] flex items-end justify-between pointer-events-auto">
        {/* Country Name & Video Reference */}
        <div>
          <span className="inline-block text-white/80 text-xs tracking-[0.14em] uppercase border border-white/25 rounded-full px-3 py-1 mb-2 backdrop-blur-sm">
            {currentSlide.label}
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight mb-1">
            {currentSlide.title}
          </h1>
          {currentSlide.credits && (
            <p className="text-white/65 text-xs md:text-sm tracking-wide">
              {currentSlide.credits}
            </p>
          )}
        </div>

        {/* Minimal Slide Dots */}
        <div className="flex gap-2.5 pb-1">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              aria-label={`Go to ${VIDEOS[i].title}`}
              className="h-[6px] rounded-full transition-all duration-500 focus:outline-none"
              style={{
                width: i === currentIdx ? "28px" : "6px",
                background: i === currentIdx ? "#fff" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
