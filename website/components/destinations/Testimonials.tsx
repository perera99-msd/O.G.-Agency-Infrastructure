"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  name: string;
  role: string;
  image: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Kasun Milinda Perera",
    role: "4 years in Germany as an Electrician",
    image: "/images/testimonials/kasun-perera.png",
    quote:
      "I never imagined I could earn this much back home. OG Agency handled everything visa, flights, even my first month's accommodation. I'm now sending double what I used to make to my family in Galle.",
  },
  {
    name: "Nimali Fernando",
    role: "Hotel Supervisor in Cyprus",
    image: "/images/testimonials/nimali.png",
    quote:
      "The process was so smooth I kept waiting for something to go wrong. It never did. I arrived to a furnished room, a welcoming employer, and a salary that actually lets me save. Three years later, I'm still here.",
  },
  {
    name: "Dinesh Wickramasinghe",
    role: "Construction Foreman in Bosnia",
    image: "/images/testimonials/dinesh.png",
    quote:
      "I was sceptical at first. But from the moment I registered with OG Agency, everything was transparent the salary, the contract, the working hours. No surprises. That trust is hard to find.",
  },
  {
    name: "Sanduni Manisha Silva",
    role: "Healthcare Aide in Romania",
    image: "/images/testimonials/sanduni.png",
    quote:
      "Working abroad as a woman, I had a lot of concerns. OG Agency gave me a direct contact I could call at any time. Knowing someone had my back made all the difference when I first arrived alone.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (idx: number) => {
    const newIdx = (idx + TESTIMONIALS.length) % TESTIMONIALS.length;
    if (newIdx === targetIndex) return;
    setTargetIndex(newIdx);
    setFading(true);
    setTimeout(() => {
      setCurrent(newIdx);
      setFading(false);
    }, 280);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goTo(targetIndex + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [targetIndex]);

  const t = TESTIMONIALS[current];

  return (
    <section className="px-6 py-16 md:px-16 lg:px-24">

      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span 
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5 mb-3"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.01))",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "var(--color-secondary-700)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.6)"
            }}
          >
            Testimonials
          </span>
          <h2
            className="text-gray-900 leading-none m-0"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 64px)", letterSpacing: "0.02em" }}
          >
            Their Words,<br />Not Ours
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => goTo(targetIndex - 1)}
            aria-label="Previous testimonial"
            className="w-12 h-12 rounded-full border-2 border-gray-900 text-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => goTo(targetIndex + 1)}
            aria-label="Next testimonial"
            className="w-12 h-12 rounded-full border-2 border-gray-900 text-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main stage */}
      <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden">

        {/* Left: quote */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
          <div>
            {/* Giant quote mark */}
            <div
              className="leading-none text-blue-950 mb-2 select-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "96px", lineHeight: 0.8 }}
              aria-hidden="true"
            >
              "
            </div>
            <p
              className="text-lg text-gray-800 leading-relaxed italic m-0"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              {t.quote}
            </p>
          </div>

          {/* Person row */}
          <div
            className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100"
            style={{
              opacity: fading ? 0 : 1,
              transition: "opacity 0.4s ease 0.05s",
            }}
          >
            <div className="ml-auto text-right">
              <p className="">{t.name}</p>
              <p className="text-xs text-gray-400 m-0">{t.role}</p>
            </div>
          </div>
        </div>

        {/* Right: country photo */}
        <div 
          className="relative w-full lg:w-[30%] xl:w-[33%] max-w-[400px] mx-auto lg:mx-0 aspect-square shrink-0 bg-gray-100 rounded-[2rem]"
          style={{ perspective: "1000px" }}
        >
          {TESTIMONIALS.map((person, i) => {
            let offset = i - targetIndex;
            if (targetIndex === 0 && i === TESTIMONIALS.length - 1) offset = -1;
            if (targetIndex === TESTIMONIALS.length - 1 && i === 0) offset = 1;

            if (Math.abs(offset) > 1) {
              offset = offset > 0 ? 2 : -2;
            }

            const isActive = offset === 0;

            return (
              <div
                key={person.name}
                className="absolute inset-0 bg-cover bg-center rounded-[2rem]"
                style={{
                  backgroundImage: `url(${person.image})`,
                  opacity: isActive ? 1 : 0,
                  transform: `rotateY(${offset * 90}deg)`,
                  transformOrigin: "center center -150px",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: isActive ? 10 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              />
            );
          })}
        </div>
      </div>



    </section>
  );
}