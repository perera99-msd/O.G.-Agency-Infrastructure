"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SLIDES = [
  {
    country: "BOSNIA",
    label: "Europe",
    title: "Bosnia",
    sub: " · Tax-free salary · World-class lifestyle",
    bgImage: "/images/destinations/sky.png",
    fgImage: "/images/destinations/Bosnia-fg.png",
  },
  {
    country: "CYPRUS",
    label: "Europe",
    title: "Cyprus",
    sub: " · Mediterranean lifestyle · Great work-life balance",
    bgImage: "/images/destinations/sky.png",
    fgImage: "/images/destinations/cypress-fg.png",
  },
  {
    country: "GERMANY",
    label: "Europe",
    title: "Germany",
    sub: " · Strong economy · Excellent healthcare & benefits",
    bgImage: "/images/destinations/sky.png",
    fgImage: "/images/destinations/Germany-fg.png",
  },
  {
    country: "ROMANIA",
    label: "Europe",
    title: "Romania",
    sub: " · Fast-growing economy · Low cost of living",
    bgImage: "/images/destinations/sky.png",
    fgImage: "/images/destinations/Romania-fg.png",
  },
  {
    country: "RUSSIA",
    label: "Eurasia",
    title: "Russia",
    sub: " · Vast opportunities · Rich cultural heritage",
    bgImage: "/images/destinations/sky.png",
    fgImage: "/images/destinations/russia-fg.png",
  },
];

const SLIDE_DURATION = 3000;

// Animation phases:
// 0 = Start (hidden)
// 1 = FG pans up
// 2 = Name & title pans up & fades in (FULLY VISIBLE STATE)
// 3 = Name & title pans down & fades out
// 4 = FG pans down
type Phase = 0 | 1 | 2 | 3 | 4;

export default function DestinationsHero() {
  const [current, setCurrent] = useState(0);

  const [phase, setPhase] = useState<Phase>(2); // start fully revealed on mount

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const goTo = useCallback((idx: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Phase 3: Name & title fade out down
    setPhase(3);
    setTimeout(() => {
      // Phase 4: FG pans down
      setPhase(4);
      setTimeout(() => {
        // Switch slide
        setPhase(0);
        setCurrent((idx + SLIDES.length) % SLIDES.length);
        
        setTimeout(() => {
          // Phase 1: next FG pans up
          setPhase(1);
          setTimeout(() => {
            // Phase 2: next Name & title fade in up
            setPhase(2);
            isAnimatingRef.current = false;
            startTimeRef.current = null; // Restart 3s timer
          }, 1000); // wait for FG to pan up
        }, 50); // slight DOM update gap
      }, 500); // wait for FG to pan down
    }, 600); // wait for name to fade out
  }, []);

  useEffect(() => {
    const tick = (ts: number) => {
      if (isAnimatingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      if (elapsed >= SLIDE_DURATION) {
        goTo((current + 1) % SLIDES.length);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [current, goTo]);

  const slide = SLIDES[current];
  const fgRevealed = phase >= 1 && phase <= 3;
  const nameRevealed = phase === 2;

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "800px" }}
    >
      {/* === LAYER 1: Background sky (same for all slides) === */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url(${slide.bgImage})`,
          transform: `scale(1.06)`,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25 z-[1]" />

      {/* === LAYER 2: Country name — white bold, appears AFTER fg pan === */}
      <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(100px, 20vw, 200px)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.06em",
            lineHeight: 1,
            userSelect: "none",
            textAlign: "center",
            opacity: nameRevealed ? 0.75 : 0,
            transform: nameRevealed
              ? "translateY(-100px)"
              : "translateY(32px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          {slide.country}
        </span>
      </div>

      {/* === LAYER 3: Foreground PNG — pans up from bottom first === */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          backgroundImage: `url(${slide.fgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          transform: fgRevealed
            ? "translateY(0%)"
            : "translateY(100%)",
          transition: "transform 1.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* === Slide info bottom === */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[4] px-10 pb-10 pt-32"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
      >
        <span className="inline-block text-white/80 text-xs tracking-[0.14em] uppercase border border-white/25 rounded-full px-3 py-1 mb-3 backdrop-blur-sm">
          {slide.label}
        </span>
        <h1
          className="text-white text-4xl font-semibold tracking-tight mb-1"
          style={{
            opacity: nameRevealed ? 1 : 0,
            transform: nameRevealed ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.75s ease 0.22s, transform 0.75s ease 0.22s",
          }}
        >
          {slide.title}
        </h1>
        <p
          className="text-white/60 text-sm"
          style={{
            opacity: nameRevealed ? 1 : 0,
            transition: "opacity 0.75s ease 0.45s",
          }}
        >
          {slide.sub}
        </p>
      </div>


      {/* Dots */}
      <div className="absolute bottom-9 right-10 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to ${SLIDES[i].title}`}
            className="h-[6px] rounded-full transition-all duration-500"
            style={{
              width: i === current ? "24px" : "6px",
              background: i === current ? "#fff" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </section>
  );
}