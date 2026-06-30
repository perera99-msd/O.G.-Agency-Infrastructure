"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  {
    country: "Romania",
    region: "European Union",
    tagline: "Garment Factories & Industrial Specialists",
    image: "/images/destinations/romania-card.jpg",
    link: "/destinations",
  },
  {
    country: "Bosnia & Herzegovina",
    region: "Southeastern Europe",
    tagline: "Apparel Tailors & Machine Operators",
    image: "/images/destinations/bosnia-card.jpg",
    link: "/destinations",
  },
  {
    country: "Russia",
    region: "Eurasian Hub",
    tagline: "Textile Production & Specialized Manpower",
    image: "/images/destinations/russia-card.jpg",
    link: "/destinations",
  },
];

export default function FeaturedDestinations() {
  return (
    <section data-nav-theme="dark" className="relative w-full py-28 bg-main-900 text-main-50 overflow-hidden px-6 lg:px-16">
      <div className="max-w-[1650px] mx-auto relative z-10">
        {/* Simple & Clean Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-main-50/15 pb-8">
          <div>
            <span className="block text-main-300 text-xs font-bold tracking-[0.25em] uppercase mb-3">
              Primary Employment Hubs
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-main-50">
              Where We Build <span className="text-main-300">Careers</span>
            </h2>
          </div>

          <p className="text-main-50/75 text-sm sm:text-base max-w-lg leading-relaxed font-normal">
            Highlighting our core global destinations where we connect specialized manpower—from Juki machine operators to garment factory specialists—with world-class opportunities.
          </p>
        </div>

        {/* 3 Large Image-Focused Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
          {destinations.map((item, idx) => (
            <motion.div
              key={item.country}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={item.link}
                className="group relative block rounded-3xl overflow-hidden bg-main-700/30 border border-main-50/15 h-[700px] xl:h-[760px] shadow-2xl transition-all duration-500 hover:border-main-300 hover:-translate-y-2"
              >
                {/* 100% Clear Background Image (Zoom on Hover) */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {/* Subtle Gradient only at the bottom 35% so text is legible while image remains 100% visible above */}
                  <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-main-900 via-main-900/80 to-transparent z-10 pointer-events-none" />
                </div>

                {/* Minimal Content at Bottom */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-8 sm:p-10 flex flex-col justify-end">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-main-300 text-xs font-bold tracking-[0.2em] uppercase">
                      {item.region}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-main-50/15 backdrop-blur-md border border-main-50/20 flex items-center justify-center text-main-50 group-hover:bg-main-300 group-hover:text-main-900 group-hover:border-main-300 transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <h3 className="text-4xl sm:text-5xl font-heading font-bold text-main-50 mb-2 group-hover:text-main-300 transition-colors duration-300">
                    {item.country}
                  </h3>

                  <p className="text-main-50/80 text-sm sm:text-base font-light tracking-wide">
                    {item.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
