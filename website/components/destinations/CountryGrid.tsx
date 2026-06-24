"use client";

import { useState } from "react";
import Link from "next/link";

type Region = "all" | "europe" | "middle-east" | "asia" | "eurasia";

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

const COUNTRIES: Country[] = [
  {
    slug: "bosnia",
    name: "Bosnia",
    flag: "/home/hero2/ba.svg",
    region: "europe",
    jobCount: "120+",
    salaryRange: "€900 – €1,800",
    tags: ["Construction", "Manufacturing", "Services"],
    image: "/images/countryGrid/bosnia-cg.jpg",
    accommodationIncluded: true,
  },
  {
    slug: "cyprus",
    name: "Cyprus",
    flag: "/home/hero2/cy.svg",
    region: "europe",
    jobCount: "90+",
    salaryRange: "€1,000 – €1,600",
    tags: ["Tourism", "Hospitality"],
    image: "/images/countryGrid/cyprus-cg.jpg",
  },
  {
    slug: "dubai",
    name: "Dubai (UAE)",
    flag: "/home/hero2/ae.svg",
    region: "middle-east",
    jobCount: "250+",
    salaryRange: "Tax-free salary",
    tags: ["Construction", "Retail", "Healthcare"],
    image: "/images/countryGrid/dubai-cg.jpg",
    accommodationIncluded: true,
  },
  {
    slug: "germany",
    name: "Germany",
    flag: "/home/hero2/de.svg",
    region: "europe",
    jobCount: "300+",
    salaryRange: "€1,800 – €3,500",
    tags: ["Engineering", "Healthcare"],
    image: "/images/countryGrid/germany-cg.jpg",
  },
  {
    slug: "israel",
    name: "Israel",
    flag: "/home/hero2/il.svg",
    region: "middle-east",
    jobCount: "150+",
    salaryRange: "$2,000 – $3,500",
    tags: ["Caregiving", "Construction"],
    image: "/images/countryGrid/israel-cg.jpg",
    accommodationIncluded: true,
  },
  {
    slug: "jordan",
    name: "Jordan",
    flag: "/home/hero2/jo.svg",
    region: "middle-east",
    jobCount: "80+",
    salaryRange: "Tax-free salary",
    tags: ["Garment", "Manufacturing"],
    image: "/images/countryGrid/jordan-cg.jpg",
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    flag: "/home/hero2/my.svg",
    region: "asia",
    jobCount: "200+",
    salaryRange: "RM1,500 – RM2,500",
    tags: ["Manufacturing", "Plantation"],
    image: "/images/countryGrid/malaysia-cg.jpg",
    accommodationIncluded: true,
  },
  {
    slug: "romania",
    name: "Romania",
    flag: "/home/hero2/ro.svg",
    region: "europe",
    jobCount: "150+",
    salaryRange: "€700 – €1,400",
    tags: ["Agriculture", "Logistics"],
    image: "/images/countryGrid/romania-cg.jpg",
  },
  {
    slug: "russia",
    name: "Russia",
    flag: "/home/hero2/ru.svg",
    region: "eurasia",
    jobCount: "200+",
    salaryRange: "₽60k – ₽120k/mo",
    tags: ["Mining", "Transport"],
    image: "/images/countryGrid/rissia-cg.jpg",
  },
];

const FILTERS: { label: string; value: Region }[] = [
  { label: "All", value: "all" },
  { label: "Europe", value: "europe" },
  { label: "Middle East", value: "middle-east" },
  { label: "Asia", value: "asia" },
  { label: "Eurasia", value: "eurasia" },
];

export default function CountryGrid() {
  const [activeRegion, setActiveRegion] = useState<Region>("all");

  const filtered = COUNTRIES.filter(
    (c) => activeRegion === "all" || c.region === activeRegion
  );

  // First card in filtered list gets featured (span-2) treatment
  const getFeatured = (idx: number, country: Country) =>
    idx === 0 && (activeRegion === "all" ? country.featured : true);

  return (
    <section className="px-6 py-16 md:px-16 lg:px-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          {/* <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 mb-3">
            <span>—</span> Destinations
          </span> */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Work Abroad Destinations
          </h1>
        </div>
        <Link
          href="/destinations"
          className="hidden md:inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          View All Destinations
          <span className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 9L9 2M9 2H3M9 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>

      {/* Region filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveRegion(f.value)}
            className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 ${
              activeRegion === f.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((country) => {
          return (
            <Link
              key={country.slug}
              href={`/destinations/${country.slug}`}
              className="group rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-gray-300 transition-all duration-200"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${country.image})` }}
                />
                {/* Fallback gradient if image not loaded */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 -z-10" />
                <span className="absolute top-3 left-3 text-xs text-white bg-black/40 rounded-full px-2.5 py-1 backdrop-blur-sm capitalize">
                  {country.region.replace("-", " ")}
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-base font-semibold text-gray-900 mb-0.5 flex items-center gap-2">
                  {country.flag.startsWith('/') || country.flag.startsWith('http') || country.flag.match(/\.(png|jpe?g|svg|gif|webp)$/i) ? (
                    <img src={country.flag.startsWith('/') || country.flag.startsWith('http') ? country.flag : `/${country.flag}`} alt={`${country.name} flag`} className="w-6 h-6 inline-block rounded-full object-cover" />
                  ) : (
                    <span>{country.flag}</span>
                  )}
                  <span>{country.name}</span>
                </p>
                {/* <p className="text-xs text-gray-400 mb-3">
                  {country.jobCount} active openings
                </p> */}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {country.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                      {country.salaryRange}
                    </span>
                    {country.accommodationIncluded && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Accom. incl.
                      </span>
                    )}
                  </div>
                  <span className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center transition-transform duration-150 group-hover:scale-110">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 9L9 2M9 2H3M9 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}