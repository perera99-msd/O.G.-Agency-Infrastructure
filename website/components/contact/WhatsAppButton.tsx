"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsAppButton() {
  const whatsappNumber = "9477663664"; // Managing Director's number
  const message = encodeURIComponent("Hello OG Agency, I would like to make an inquiry.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip text showing on hover */}
      <span className="mr-3 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-secondary-900 text-main-50 text-xs font-medium py-1.5 px-3 rounded-lg shadow-md font-sans">
        Chat on WhatsApp
      </span>

      {/* Button link */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] transition-shadow duration-300 cursor-pointer"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulsing ring animation behind the logo */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping pointer-events-none" />

        {/* WhatsApp Icon Image */}
        <div className="relative w-8 h-8 z-10 flex items-center justify-center">
          <Image
            src="/WhatsApp.svg.webp"
            alt="WhatsApp Logo"
            fill
            sizes="32px"
            className="object-contain"
          />
        </div>
      </motion.a>
    </div>
  );
}
