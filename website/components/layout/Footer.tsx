"use client";

import Link from "next/link";
import { Globe2, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-main-900 pt-16 pb-8 px-6 lg:px-16 border-t border-main-900/10">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        {/* Left: Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-4 group w-fit">
            <img src="/Logo/logo.png" alt="O.G. Agency Logo" className="h-16 md:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]" />
            <span className="font-[family-name:var(--font-cinzel)] font-bold text-2xl md:text-3xl tracking-[0.08em] uppercase text-main-50">O.G. Agency</span>
          </Link>
          <p className="text-secondary-400 text-xs max-w-sm leading-relaxed font-medium">
            Empowering the next global era by connecting ambition with world-class opportunities. We build careers, not just visas.
          </p>
        </div>

        {/* Right: Links & Socials */}
        <div className="flex flex-col md:items-end gap-6">
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {[
              { name: "About", href: "/about" },
              { name: "Services", href: "/services" },
              { name: "Destinations", href: "/destinations" },
              { name: "Jobs", href: "/jobs" },
              { name: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-main-50/70 hover:text-main-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/contact" className="w-10 h-10 rounded-full bg-main-50/5 flex items-center justify-center text-main-50 hover:bg-main-50 hover:text-main-900 transition-all">
              <MapPin size={16} />
            </Link>
            <Link href="/contact" className="w-10 h-10 rounded-full bg-main-50/5 flex items-center justify-center text-main-50 hover:bg-main-50 hover:text-main-900 transition-all">
              <Phone size={16} />
            </Link>
            <Link href="/contact" className="w-10 h-10 rounded-full bg-main-50/5 flex items-center justify-center text-main-50 hover:bg-main-50 hover:text-main-900 transition-all">
              <Mail size={16} />
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom: Copyright */}
      <div className="max-w-[1600px] mx-auto w-full mt-16 pt-8 border-t border-main-50/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-main-50/50 font-medium tracking-wider uppercase">
          &copy; {new Date().getFullYear()} O.G. Agency. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-[10px] text-main-50/50 hover:text-main-50 font-medium tracking-wider uppercase transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-[10px] text-main-50/50 hover:text-main-50 font-medium tracking-wider uppercase transition-colors">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}