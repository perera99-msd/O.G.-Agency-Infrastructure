"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─── Data ─────────────────────────────────────────────── */

const BENEFITS = [
  {
    title: "Visa & Flight Support",
    desc: "We handle your work permit, visa documentation and arrange your flight to your destination.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
    ),
  },
  {
    title: "Accommodation Included",
    desc: "Employer provided furnished housing waiting for you on arrival in select countries.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    title: "Tax-Free Salaries",
    desc: "Earn significantly more with tax-exempt pay packages in Middle East destinations.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </svg>
    ),
  },
  {
    title: "24/7 Dedicated Support",
    desc: "A personal contact you can reach any time, especially during your first weeks abroad.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: "Transparent Contracts",
    desc: "Clear salary, hours and conditions no hidden fees, no surprises when you arrive.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
  {
    title: "9+ Countries Available",
    desc: "Europe, Middle East and Asia choose your region and we match you to the right job.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

/* ─── Layout constants ──────────────────────────────────── */
const SCENE_H  = 480;   // px — total section height
const CARD_W   = 310;   // px — card width
const CARD_H   = 190;   // px — approx card height (used for Y centering)
const ACTIVE_X = 22;    // px from right edge for the active card
const STEP_Y   = 170;   // vertical distance between consecutive card centres
const ARC_X    = 28;    // extra rightward push per step away from active
const N        = BENEFITS.length;

/* ─── Component ─────────────────────────────────────────── */

export default function WhyChooseUs() {
  const sceneRef   = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef    = useRef<HTMLDivElement>(null);

  // Mutable state — kept in refs so RAF doesn't re-render React
  const progressRef = useRef(0); // snapped integer target
  const displayRef  = useRef(0); // smooth float for rendering
  const dragging    = useRef(false);
  const dragStartY  = useRef(0);
  const dragStartP  = useRef(0);
  const rafId       = useRef<number | null>(null);
  const lastWheel   = useRef(0);

  /* ── Position all cards based on a float progress value ── */
  const positionCards = useCallback((prog: number) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      const offset = i - prog;
      const absOff = Math.abs(offset);

      // X: active sits ACTIVE_X from right; others arc further right
      const xFromRight = ACTIVE_X + absOff * ARC_X + absOff * absOff * 6;

      // Y: stack above / below the active centre
      const activeTop = (SCENE_H - CARD_H) / 2;
      const y = activeTop + offset * STEP_Y;

      // Proximity → visual weight
      const prox     = Math.max(0, 1 - absOff * 0.95);
      const scale    = 0.72 + prox * 0.28;
      const opacity  = 0.30 + prox * 0.70;
      const blur     = (1 - prox) * 3;
      const shadow   = prox > 0.5
        ? `0 12px 40px rgba(0,0,0,${(prox * 0.14).toFixed(2)})`
        : "none";

      el.style.right          = `${xFromRight}px`;
      el.style.top            = `${y}px`;
      el.style.transform      = `scale(${scale.toFixed(3)})`;
      el.style.transformOrigin = "right center";
      el.style.opacity        = opacity.toFixed(3);
      el.style.filter         = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.boxShadow      = shadow;
      el.style.zIndex         = String(Math.round(prox * 10));
    });
  }, []);

  /* ── RAF loop: lerp display → progress ── */
  useEffect(() => {
    const tick = () => {
      const cur = displayRef.current;
      const tgt = progressRef.current;
      const next = cur + (tgt - cur) * 0.11;
      displayRef.current = Math.abs(next - tgt) < 0.001 ? tgt : next;
      positionCards(displayRef.current);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [positionCards]);

  /* ── Scroll ── */
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      // Enforce an 800ms cooldown so 1 trackpad swipe = exactly 1 card move
      if (now - lastWheel.current < 800) return;
      
      if (hintRef.current) hintRef.current.style.opacity = "0";
      const dir = e.deltaY > 0 ? 1 : -1;
      progressRef.current = Math.max(0, Math.min(N - 1, Math.round(progressRef.current + dir)));
      lastWheel.current = now;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* ── Pointer drag ── */
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      dragging.current  = true;
      dragStartY.current = e.clientY;
      dragStartP.current = progressRef.current;
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      if (hintRef.current) hintRef.current.style.opacity = "0";
      const dy    = dragStartY.current - e.clientY;
      // Reduced drag sensitivity: increased divisor from 70 to 180
      const steps = dy / 180;
      progressRef.current = Math.max(0, Math.min(N - 1, dragStartP.current + steps));
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current   = false;
      progressRef.current = Math.max(0, Math.min(N - 1, Math.round(progressRef.current)));
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup",   onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup",   onUp);
    };
  }, []);

  /* ── Render ── */
  return (
    <section className="px-6 py-16 md:px-16 lg:px-24">

      {/* Section label */}
      <div className="flex justify-center mb-4">
        <span 
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.01))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.08)",
            color: "var(--color-secondary-700)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.6)"
          }}
        >
          Why Work Abroad
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-center mb-6">
        Unlock Global Opportunities For Your Career
      </h2>

      {/* Scene */}
      <div
        ref={sceneRef}
        className="relative w-full overflow-hidden rounded-2xl select-none"
        style={{ height: `${SCENE_H}px`, cursor: "grab" }}
      >
        {/* Full-bleed background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/why.png)" }}
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Floating cards */}
        {BENEFITS.map((b, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute"
            style={{
              width: `${CARD_W}px`,
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "24px",
              padding: "26px 28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              pointerEvents: "none",
              // initial position — will be overwritten by RAF on first frame
              right: `${ACTIVE_X}px`,
              top: `${(SCENE_H - CARD_H) / 2}px`,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.02))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginBottom: 6,
              }}
            >
              {b.icon}
            </div>

            {/* Text */}
            <h5 className="m-0" style={{ color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              {b.title}
            </h5>
            <p className="m-0" style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
              {b.desc}
            </p>
          </div>
        ))}

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-4 right-5 text-white/70 text-xs tracking-widest uppercase"
        >
          Scroll down • hover cards • scroll up
        </div>
      </div>
    </section>
  );
}
