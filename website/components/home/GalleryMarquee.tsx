"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  dateAdded: string;
}

export default function GalleryMarquee() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const q = query(collection(db, "gallery"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GalleryImage[];
      // Sort by dateAdded descending — newest first
      items.sort(
        (a, b) =>
          new Date(b.dateAdded || 0).getTime() -
          new Date(a.dateAdded || 0).getTime()
      );
      setImages(items);
    });
    return () => unsub();
  }, []);

  // Duplicate for seamless infinite loop — need at least a few to look good
  const marqueeItems = images.length > 0 ? [...images, ...images] : [];

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

        {marqueeItems.length > 0 ? (
          <div className="animate-infinite-marquee gap-6 px-3">
            {marqueeItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="relative group w-[320px] sm:w-[380px] md:w-[440px] h-[280px] sm:h-[320px] md:h-[350px] rounded-3xl overflow-hidden bg-main-700/10 border border-main-900/10 shadow-md shrink-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-main-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-main-300 text-[10px] font-bold tracking-wider uppercase">
                    {item.category}
                  </span>
                  <span className="text-main-50 font-heading font-semibold text-base truncate">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Loading skeleton while Firestore data arrives */
          <div className="flex gap-6 px-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[320px] sm:w-[380px] md:w-[440px] h-[280px] sm:h-[320px] md:h-[350px] rounded-3xl bg-main-200/40 animate-pulse shrink-0"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
