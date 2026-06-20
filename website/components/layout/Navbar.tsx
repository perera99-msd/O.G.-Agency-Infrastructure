"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe2 } from "lucide-react";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Destinations", href: "/destinations" },
  { name: "Blog", href: "/blog" },
  { name: "App", href: "/app" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const useLightText = !isHome && !scrolled;

  const textColor = useLightText ? "text-white" : "text-main-900";
  const mutedTextColor = useLightText ? "text-white/70" : "text-main-900/60";
  const hoverTextColor = useLightText ? "hover:text-white" : "hover:text-main-900";
  
  const buttonBg = useLightText ? "bg-white" : "bg-main-900";
  const buttonText = useLightText ? "text-main-900" : "text-main-50";
  const buttonHover = useLightText ? "hover:bg-white/90" : "hover:bg-main-700";

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 flex items-center px-6 lg:px-16 ${scrolled ? "h-[80px] bg-white/90 backdrop-blur-md shadow-sm border-b border-main-900/5 pointer-events-auto" : "h-[100px] bg-transparent pointer-events-none"}`}>
      <nav className="max-w-[1600px] mx-auto w-full flex items-center justify-between pointer-events-auto">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group z-20">
          <Globe2 size={24} className={`${textColor} group-hover:rotate-180 transition-all duration-700 ease-in-out`} />
          <span className={`font-heading font-bold text-xl tracking-tight transition-colors duration-300 ${textColor}`}>O.G. Agency</span>
        </Link>

        {/* Middle: Flat Navigation Links */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 ${isActive ? textColor : `${mutedTextColor} ${hoverTextColor}`}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Contact CTA */}
        <div className="flex items-center gap-8 z-20">
          <Link href="/contact" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${buttonBg} ${buttonText} px-8 py-3.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase ${buttonHover} transition-colors shadow-xl`}
            >
              Contact Us
            </motion.button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden p-2 pointer-events-auto transition-colors duration-300 ${textColor}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-main-900/10 overflow-hidden lg:hidden z-50 p-6 flex flex-col gap-4 pointer-events-auto transition-all duration-500 ${scrolled ? "top-[90px]" : "top-[90px] sm:top-[100px]"}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold tracking-[0.2em] uppercase text-secondary-700 hover:text-main-900 py-3 border-b border-main-900/5"
              >
                {link.name}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsOpen(false)} className="mt-4">
              <button className="w-full bg-main-900 text-main-50 px-4 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-md">
                Contact Us
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}