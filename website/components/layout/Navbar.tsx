"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe2 } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Destinations", href: "/destinations" }, // Placeholder for next week
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-main-50/80 backdrop-blur-md border-b border-secondary-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 text-main-900 hover:text-main-500 transition-colors">
          <Globe2 size={32} className="text-main-500" />
          <span className="font-heading font-bold text-2xl tracking-tight">O.G. Agency</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-main-700 font-medium hover:text-main-300 transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-main-700 text-main-50 px-6 py-2.5 rounded-lg font-medium hover:bg-main-900 transition-colors shadow-md"
            >
              Contact Us
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-main-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-main-50 border-b border-secondary-100 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-main-700 font-medium text-lg border-b border-secondary-100 pb-2"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-main-700 text-main-50 px-6 py-3 rounded-lg font-medium mt-2">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}