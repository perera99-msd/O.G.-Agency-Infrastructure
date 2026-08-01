"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion as motionFramer, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Search, Grid3X3, LayoutGrid } from "lucide-react";
import Image from "next/image";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  dateAdded: string;
}


/* ─── Scroll reveal variants ─── */
const cardReveal = {
  hidden: (_i: number) => ({
    opacity: 0,
    y: 60,
    scale: 0.95,
    rotateX: 4,
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: (i % 3) * 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function GalleryContent({ items = [] }: { items?: GalleryItem[] }) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"editorial" | "grid">("editorial");
  const galleryRef = useRef<HTMLDivElement>(null);

  // Hero Coverflow State
  const heroItems = items.slice(0, 7);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
    return ["All", ...cats];
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  // Lightbox Navigation
  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex(prev => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
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
          return prev === filteredItems.length - 1 ? 0 : prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, activeImageIndex]);

  // Parallax for the bridge section
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });
  const bridgeY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  return (
    <div className="w-full bg-main-50 flex flex-col">
      {/* ==================== HERO HEADER SECTION (FULL SCREEN) ==================== */}
      <section className="relative w-full h-screen min-h-[720px] flex flex-col items-center justify-between overflow-hidden bg-main-900 pt-28 pb-10 select-none">

        {/* Ambient Glows */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-main-400/10 blur-[120px] rounded-full" />
          {heroItems.length > 0 && heroItems[heroSlideIndex] && (
            <Image
              src={heroItems[heroSlideIndex].imageUrl}
              alt="Background Ambient"
              fill
              className="object-cover blur-[100px] scale-125 opacity-15 transition-all duration-1000 ease-out"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-main-900/60 via-main-900/40 to-main-900" />
        </div>

        {/* Top Header Label & Title */}
        <div className="relative z-10 flex flex-col items-center text-center gap-2 px-6">
          <span className="text-main-300 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold">
            · EXCELLENCE IN MOTION ·
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl tracking-tight text-white/90">
            Global Placement Showcase
          </h1>
        </div>

        {/* 3D Coverflow Slider */}
        <div className="relative w-full z-10 flex items-center justify-center overflow-hidden flex-1 my-2">
          {heroItems.length > 0 ? (
            <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center" style={{ perspective: "1400px" }}>
              {heroItems.map((item, idx) => {
                let offset = idx - heroSlideIndex;
                if (offset < -3) offset += heroItems.length;
                if (offset > 3) offset -= heroItems.length;
                const absOffset = Math.abs(offset);
                const isActive = offset === 0;

                if (absOffset > 3) return null;

                return (
                  <motionFramer.div
                    key={item.id}
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 1 - (absOffset * 0.14),
                      x: `${offset * 40}%`,
                      z: isActive ? 0 : -absOffset * 110,
                      rotateY: offset * -14,
                      opacity: isActive ? 1 : 1 - (absOffset * 0.25),
                      zIndex: 50 - absOffset,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`absolute w-[300px] sm:w-[420px] md:w-[500px] lg:w-[560px] aspect-[4/4.5] rounded-3xl overflow-hidden cursor-pointer transition-shadow ${isActive
                        ? 'shadow-[0_20px_60px_rgba(0,168,232,0.3)] ring-2 ring-main-400/50'
                        : 'shadow-[0_15px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/10 hover:ring-white/20'
                      }`}
                    onClick={() => {
                      if (isActive) {
                        setActiveImageIndex(idx);
                      } else {
                        setHeroSlideIndex(idx);
                      }
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </motionFramer.div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-[540px] aspect-[4/4.5] rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm animate-pulse" />
            </div>
          )}
        </div>

        {/* Minimal Progress Dots */}
        <div className="relative z-20 flex items-center justify-center w-full pb-2">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
            {heroItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlideIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="h-2 rounded-full transition-all duration-500 cursor-pointer"
                style={{
                  width: i === heroSlideIndex ? "30px" : "8px",
                  backgroundColor: i === heroSlideIndex ? "#00a8e8" : "rgba(255, 255, 255, 0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRANSITIONAL BRIDGE ==================== */}
      <div className="relative w-full overflow-hidden" ref={galleryRef}>
        {/* Dark-to-light gradient bridge */}
        <div className="h-32 bg-gradient-to-b from-main-900 via-main-700/30 to-transparent" />

        {/* Floating Stats Ribbon */}
        <motionFramer.div
          style={{ y: bridgeY }}
          className="relative -mt-20 mx-auto max-w-5xl px-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-main-900/5 shadow-[0_8px_32px_rgba(0,52,89,0.08)] px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2,750+", label: "Placements" },
              { value: "98%", label: "Visa Success" },
              { value: "100%", label: "Verified" },
              { value: "EU Zone", label: "Target Region" },
            ].map((stat, i) => (
              <motionFramer.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span className="font-heading font-extrabold text-2xl md:text-3xl text-main-700 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-main-900/40 mt-1">
                  {stat.label}
                </span>
              </motionFramer.div>
            ))}
          </div>
        </motionFramer.div>
      </div>

      {/* ==================== GALLERY CONTENT SECTION ==================== */}
      <section className="w-full bg-gradient-to-b from-transparent via-main-50 to-main-50 pt-16 pb-32 px-4 sm:px-6 md:px-10 lg:px-12 2xl:px-16">
        <div className="w-full max-w-[2200px] mx-auto flex flex-col gap-0">

          {/* ─── Section Title ─── */}
          <motionFramer.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-main-300 font-semibold mb-3">
              Browse Collection
            </span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-main-900 tracking-tight leading-[1.1]">
              Our Gallery
            </h2>
            <div className="w-12 h-[3px] rounded-full bg-main-300 mt-5" />
          </motionFramer.div>

          {/* ─── Toolbar: Category Filters + View Toggle ─── */}
          <motionFramer.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10"
          >
            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {categories.map(cat => {
                const isActive = cat === selectedCategory;
                const count = cat === "All" ? items.length : items.filter(i => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      relative px-5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 cursor-pointer
                      ${isActive
                        ? "bg-main-900 text-white shadow-[0_4px_16px_rgba(0,23,31,0.2)]"
                        : "bg-main-900/[0.04] text-main-900/60 hover:bg-main-900/[0.08] hover:text-main-900"
                      }
                    `}
                  >
                    {cat}
                    <span className={`ml-1.5 text-[10px] font-mono ${isActive ? "text-main-300" : "text-main-900/30"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-main-900/[0.04] rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("editorial")}
                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === "editorial" ? "bg-white shadow-sm text-main-900" : "text-main-900/40 hover:text-main-900/60"}`}
                aria-label="Editorial view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-main-900" : "text-main-900/40 hover:text-main-900/60"}`}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
            </div>
          </motionFramer.div>

          {/* ─── Elegant Masonry Grid ─── */}
          {viewMode === "editorial" ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6">
              {filteredItems.map((item, index) => {
                // Deterministic aspect ratios for an elegant masonry look without gaps
                const aspects = [
                  "aspect-[4/5]",
                  "aspect-[3/4]",
                  "aspect-[4/3]",
                  "aspect-[16/10]",
                  "aspect-square",
                  "aspect-[9/16]"
                ];
                const aspect = aspects[index % aspects.length];

                return (
                  <motionFramer.div
                    key={item.id}
                    custom={index}
                    variants={cardReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="break-inside-avoid mb-4 md:mb-6 group relative cursor-pointer"
                    onClick={() => setActiveImageIndex(items.indexOf(item))}
                  >
                    <div className={`relative w-full ${aspect} rounded-2xl overflow-hidden bg-main-900/5`}>
                      {/* Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        loading="lazy"
                      />

                      {/* Hover overlay with info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-main-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Bottom info - visible on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.15em] uppercase bg-white/15 backdrop-blur-md text-white/90 border border-white/10 mb-2">
                          {item.category}
                        </span>
                        <p className="text-white font-heading font-semibold text-sm md:text-base leading-tight line-clamp-2 max-w-full">
                          {item.title}
                        </p>
                      </div>

                      {/* Editorial index number — top-left */}
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <span className="font-mono text-[11px] font-bold text-white/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </motionFramer.div>
                );
              })}
            </div>
          ) : (
            /* ─── Uniform Grid View ─── */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredItems.map((item, index) => (
                <motionFramer.div
                  key={item.id}
                  custom={index}
                  variants={cardReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="group relative cursor-pointer"
                  onClick={() => setActiveImageIndex(items.indexOf(item))}
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-main-900/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-main-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono tracking-[0.12em] uppercase bg-white/15 backdrop-blur-md text-white/90 border border-white/10 mb-1.5">
                        {item.category}
                      </span>
                      <p className="text-white font-heading font-semibold text-xs leading-tight line-clamp-2 max-w-full">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </motionFramer.div>
              ))}
            </div>
          )}

          {/* ─── Empty State ─── */}
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-main-900/5 flex items-center justify-center">
                <Search size={24} className="text-main-900/20" />
              </div>
              <p className="text-main-900/40 font-medium text-sm">No items found in this category</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="text-main-300 text-sm font-medium hover:underline cursor-pointer"
              >
                View all items →
              </button>
            </div>
          )}

          {/* ─── Results Count Footer ─── */}
          {filteredItems.length > 0 && (
            <motionFramer.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center mt-16 gap-3"
            >
              <div className="h-px flex-1 max-w-[100px] bg-main-900/10" />
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-main-900/30">
                {filteredItems.length} {filteredItems.length === 1 ? "Item" : "Items"} · {selectedCategory}
              </span>
              <div className="h-px flex-1 max-w-[100px] bg-main-900/10" />
            </motionFramer.div>
          )}
        </div>
      </section>

      {/* ==================== LIGHTBOX MODAL ==================== */}
      <AnimatePresence>
        {activeImageIndex !== null && items[activeImageIndex] && (
          <motionFramer.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-main-900/98 backdrop-blur-xl p-4 md:p-10 select-none"
          >
            {/* Slideshow indicator */}
            {isAutoplay && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-white text-xs font-mono tracking-wider shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-main-400 inline-block animate-ping" />
                SLIDESHOW ACTIVE
              </div>
            )}

            {/* Close */}
            <button
              onClick={() => {
                setActiveImageIndex(null);
                setIsAutoplay(false);
              }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 z-50 cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Prev */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 z-50 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 z-50 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image + info */}
            <div className="max-w-6xl w-full flex flex-col gap-4 items-center justify-center">
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

              {/* Lightbox info bar */}
              <div className="flex items-center justify-between w-full max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-white/30 tracking-wider">
                    {String(activeImageIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="text-white/50 text-xs font-medium">
                    {items[activeImageIndex].title}
                  </span>
                </div>
                <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-mono tracking-[0.15em] uppercase bg-white/5 text-white/40 border border-white/5">
                  {items[activeImageIndex].category}
                </span>
              </div>
            </div>
          </motionFramer.div>
        )}
      </AnimatePresence>
    </div>
  );
}
