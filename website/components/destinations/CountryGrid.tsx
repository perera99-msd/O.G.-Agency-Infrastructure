"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

type Region = string;

interface Country {
  slug: string;
  name: string;
  flag: string;
  region: Region;
  jobCount: string;
  salaryRange: string;
  tags: string[];
  image: string;
  accommodationIncluded?: boolean;
  featured?: boolean;
}
const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Europe", value: "europe" },
  { label: "Middle East", value: "middle-east" },
  { label: "Asia", value: "asia" },
  { label: "Eurasia", value: "eurasia" },
];

export default function CountryGrid() {
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const q = query(collection(db, "destinations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          slug: doc.id,
          name: d.country || "Unknown",
          flag: d.flag || "📍", // Fallback emoji if no flag image provided
          region: (d.region || "").toLowerCase(),
          jobCount: `${d.activeJobs || 0}+`,
          salaryRange: d.salaryRange || "Depends on Job",
          tags: d.tags || ["Opportunities"],
          image: d.heroImage || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800",
          featured: d.featured || false,
        } as Country;
      });
      setCountries(data);
    });
    return () => unsubscribe();
  }, []);

  const filtered = countries.filter(
    (c) => activeRegion === "all" || c.region.includes(activeRegion.replace("-", " ")) || c.region === activeRegion
  );

  // First card in filtered list gets featured (span-2) treatment
  const getFeatured = (idx: number, country: Country) =>
    idx === 0 && (activeRegion === "all" ? country.featured : true);

  return (
    <section className="px-6 py-16 md:px-16 lg:px-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
            Work Abroad Destinations
          </h1>
        </div>
      </div>

      {/* Region filters */}
      <div className="flex gap-3 flex-wrap mb-10">
        {FILTERS.map((f) => {
          const isActive = activeRegion === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setActiveRegion(f.value)}
              className={`text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-gray-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] -translate-y-0.5"
                  : "hover:-translate-y-0.5 hover:shadow-md"
              }`}
              style={isActive ? undefined : {
                background: "linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.01))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "var(--color-secondary-700)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.6)"
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

    {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((country) => {
          const jobPortalCountry = country.name === "United Arab Emirates" ? "UAE" : country.name;
          return (
            <Link
              key={country.slug}
              href={`/jobs?country=${encodeURIComponent(jobPortalCountry)}`}
              className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-200 relative block h-64 sm:h-72"
            >
              {/* Image filling the entire card */}
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${country.image})` }}
                />
                {/* Fallback gradient if image not loaded */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 -z-10" />
                {/* Subtle dark gradient at bottom for contrast */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>

              <span className="absolute top-3 left-3 text-xs text-white bg-black/40 rounded-full px-2.5 py-1 backdrop-blur-sm capitalize z-10">
                {country.region.replace("-", " ")}
              </span>

              {/* Body (Apple glass view) */}
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/20 backdrop-blur-md backdrop-saturate-120 border border-white/20 rounded-xl flex items-center justify-between z-10 shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:bg-black/30">
                <p className="text-base font-semibold text-white drop-shadow-sm flex items-center gap-2 m-0">
                  {country.flag.startsWith('/') || country.flag.startsWith('http') || country.flag.match(/\.(png|jpe?g|svg|gif|webp)$/i) ? (
                    <img src={country.flag.startsWith('/') || country.flag.startsWith('http') ? country.flag : `/${country.flag}`} alt={`${country.name} flag`} className="w-6 h-6 inline-block rounded-full object-cover shadow-sm" />
                  ) : (
                    <span>{country.flag}</span>
                  )}
                  <span>{country.name}</span>
                </p>
                <span className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center transition-transform duration-150 group-hover:scale-110 flex-shrink-0 backdrop-blur-md">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 9L9 2M9 2H3M9 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* Tags & Footer were intentionally removed to maintain a clean glass view */}
            </Link>
          );
        })}
      </div>
    </section>
  );
}