"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Clock, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function BlogHero() {
  return (
    <section data-nav-theme="dark" className="relative w-full min-h-[75vh] bg-main-900 text-main-50 flex items-center justify-center pt-32 pb-20 px-6 lg:px-16 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-main-700/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-main-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto w-full relative z-10">
        {/* Upper Editorial Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-main-50/10 border border-main-50/20 text-main-300 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
            <Sparkles size={14} className="text-main-500" />
            O.G. Editorial Hub & Automated Insights
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Featured Post Spotlight */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-main-500 text-sm font-bold tracking-[0.25em] uppercase mb-4 block">
              Featured Breaking Analysis
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight leading-[1.1] mb-6">
              2026 European Union <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-main-300 to-main-500">Labor & Visa Directives</span> for Industrial Workers
            </h1>
            <p className="text-main-50/80 text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-2xl">
              Discover how recent regulatory shifts in Romania, Poland, and Germany streamline rapid work permits for certified garment sewing operators, CAD pattern specialists, and heavy industrial technicians.
            </p>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-main-50/70 mb-8 border-y border-main-50/10 py-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-main-300" />
                <span className="font-semibold text-white">Wasantha Perera</span>
                <span>• Head of Global Legal Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-main-300" />
                <span>June 28, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-main-300" />
                <span>7 Min Read</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#articles-grid"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-main-900 font-bold text-xs uppercase tracking-wider hover:bg-main-300 transition-all duration-300 shadow-xl"
              >
                Read Featured Article
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right: Featured Post Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-3xl overflow-hidden border border-main-50/20 bg-main-700/20 shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                alt="European Union Garment Factory Placement"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main-900 via-main-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-3 py-1 rounded-md bg-main-500 text-main-900 font-bold text-[10px] tracking-widest uppercase mb-2">
                  POLICY UPDATE
                </span>
                <p className="text-white font-heading font-semibold text-lg line-clamp-2">
                  Rapid Onboarding Protocols for Juki Lockstitch Operators in Eastern Europe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
