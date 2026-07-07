"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", title: "Garment Sewing Line", location: "Romania" },
  { src: "https://images.unsplash.com/photo-1617791160505-6f00b046a874?auto=format&fit=crop&q=80&w=800", title: "Industrial Factory Floor", location: "Poland" },
  { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800", title: "Automated Fabric Cutting", location: "Academy" },
  { src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", title: "Sewing Stations Assessment", location: "Training Center" },
  { src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800", title: "Embroidery Division", location: "Innovation Lab" },
  { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", title: "Computerized Machinists", location: "Romania" },
  { src: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800", title: "Production Management", location: "Poland" },
  { src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800", title: "Active Apparel Assembly", location: "Lithuania" },
  { src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800", title: "Double Assembly Line", location: "Germany" },
  { src: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800", title: "Modern Sewing Workshop", location: "EU Hub" },
];

export default function GalleryMarquee() {
  return (
    <section className="relative w-full py-24 bg-main-50 overflow-hidden border-b border-main-900/10">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marqueeSlide {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-marquee {
            display: flex;
            width: max-content;
            animation: marqueeSlide 35s linear infinite;
          }
          .animate-infinite-marquee:hover {
            animation-play-state: paused;
          }
        `
      }} />

      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main-300/15 border border-main-300/30 text-main-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">
            <Sparkles size={14} className="text-main-500" />
            Placements In Action
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight text-main-900">
            Real Moments From Our <span className="text-main-500">Global Hubs</span>
          </h2>
        </div>

        <Link
          href="/gallery"
          className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-main-900 text-main-50 font-bold text-xs uppercase tracking-wider hover:bg-main-700 transition-all duration-300 shadow-lg shrink-0"
        >
          See Full Gallery
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Horizontal Continuous Sliding Track */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left and Right Fade Shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-36 bg-gradient-to-r from-main-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-36 bg-gradient-to-l from-main-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-infinite-marquee gap-6 px-3">
          {/* Duplicate list twice for seamless infinite loop */}
          {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((item, idx) => (
            <div
              key={idx}
              className="relative group w-[320px] sm:w-[380px] md:w-[440px] h-[280px] sm:h-[320px] md:h-[350px] rounded-3xl overflow-hidden bg-main-700/10 border border-main-900/10 shadow-md shrink-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-main-300 text-[10px] font-bold tracking-wider uppercase">
                  {item.location}
                </span>
                <span className="text-main-50 font-heading font-semibold text-base truncate">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
