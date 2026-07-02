"use client";

import { useState, useEffect } from "react";
import { motion as motionFramer, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  dateAdded: string;
}

const METRIC_STATS = [
  { value: "2,750+", label: "PLACEMENTS" },
  { value: "98%", label: "VISA SUCCESS" },
  { value: "100%", label: "VERIFIED" },
  { value: "EU ZONE", label: "TARGET REGION" }
];

const WORKFLOW_STEPS = [
  { num: "01", text: "Profile Screening & Machine Matching" },
  { num: "02", text: "Verification of Sewing Credentials" },
  { num: "03", text: "Embemony Checks & Visa Stamping" },
  { num: "04", text: "Pre-Departure Technical Briefings" }
];

export default function GalleryContent({ items = [] }: { items?: GalleryItem[] }) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);

  // Lightbox Navigation
  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex(prev => (prev === 0 ? items.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex(prev => (prev === items.length - 1 ? 0 : prev! + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex !== null) {
        if (e.key === "Escape") {
          setActiveImageIndex(null);
          setIsAutoplay(false);
        }
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex]);

  // Lock scroll
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImageIndex]);

  // Autoplay slideshow timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoplay && activeImageIndex !== null) {
      interval = setInterval(() => {
        setActiveImageIndex(prev => {
          if (prev === null) return null;
          return prev === items.length - 1 ? 0 : prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, activeImageIndex]);

  return (
    <div className="w-full bg-main-50 flex flex-col">
      {/* ==================== HERO HEADER SECTION ==================== */}
      <section className="relative w-full h-[95vh] min-h-[650px] flex flex-col justify-end overflow-hidden bg-main-900 text-white pb-12">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">

          {/* Deep Navy/Black linear gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-main-900 via-main-900/60 to-black/30" />
        </div>

        {/* Hero Content (Play Button, Subtitle, Title, Stats) */}
        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto flex flex-col items-center text-center gap-6 mt-auto">
          {/* Play button */}
          <motionFramer.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveImageIndex(0);
              setIsAutoplay(true);
            }}
            className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <Play size={28} fill="currentColor" className="ml-1" />
          </motionFramer.button>

          <span className="!text-main-300 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold">
            · O.G. AGENCY SPECIALISTS ·
          </span>

          <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight max-w-4xl tracking-tight !text-white">
            Garment & Apparel Placements
          </h2>

          {/* Stats Badges row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2 max-w-2xl bg-black/35 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl">
            {METRIC_STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center px-4 md:px-6 py-1 border-r border-white/10 last:border-0">
                <span className="font-heading font-black text-xl md:text-2xl !text-white tracking-tight">{stat.value}</span>
                <span className="text-[8px] font-bold !text-main-300 uppercase tracking-widest font-mono mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Steps/Workflow footer lines */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/15 text-left">
            {WORKFLOW_STEPS.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-main-300 border border-main-300/30 px-2 py-0.5 rounded">
                  {step.num}
                </span>
                <p className="!text-secondary-100 text-xs font-medium leading-relaxed max-w-[200px]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CONTENT LIST SECTION ==================== */}
      <section className="w-full bg-main-50 py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-3 mb-4">
            <h3 className="font-heading font-black text-3xl md:text-4xl text-main-900 tracking-tight leading-none">
              Our Gallery
            </h3>
          </div>

          {/* Vertical template cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {items.map((item, index) => (
              <motionFramer.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col cursor-pointer"
                onClick={() => setActiveImageIndex(index)}
              >
                {/* Image card wrapper */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-main-900/5 bg-secondary-900/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>


              </motionFramer.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LIGHTBOX MODAL (PHOTO VIEW) ==================== */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motionFramer.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-main-900/98 backdrop-blur-lg p-4 md:p-10 select-none"
          >
            {/* Slideshow visual indicator */}
            {isAutoplay && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-white text-xs font-mono tracking-wider shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-main-400 inline-block animate-ping" />
                SLIDESHOW ACTIVE
              </div>
            )}

            <button
              onClick={() => {
                setActiveImageIndex(null);
                setIsAutoplay(false);
              }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 z-50 cursor-pointer"
            >
              <X size={24} />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 z-50 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 z-50 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            <div className="max-w-6xl w-full flex flex-col gap-6 items-center justify-center mt-8">
              <motionFramer.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-h-[80vh] w-full flex justify-center items-center overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={items[activeImageIndex].imageUrl}
                  alt={items[activeImageIndex].title}
                  className="max-h-[80vh] max-w-full object-contain rounded-2xl border border-white/10 shadow-2xl"
                />
              </motionFramer.div>
            </div>
          </motionFramer.div>
        )}
      </AnimatePresence>
    </div>
  );
}
