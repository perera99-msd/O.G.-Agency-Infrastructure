"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function ContactHero() {
    return (
        <section className="relative w-full h-[70vh] min-h-[520px] flex items-end overflow-hidden bg-main-900">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/hero-contactUs.png"
                    alt="Contact Us Hero"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-main-900/70" />
            </div>

            {/* Content — bottom-left, matching global px */}
            <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pb-16 md:pb-20">
                <div className="max-w-screen-xl mx-auto">

                    {/* Signature rule */}
                    <motion.div
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="w-16 h-[2px] bg-main-300 mb-6"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-secondary-100 font-mono text-xs tracking-[0.2em] uppercase mb-4"
                    >
                        OG Agency · International Careers
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-main-50 tracking-tight leading-[0.95] mb-6"
                    >
                        Contact Us
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-secondary-100/80 font-sans text-base md:text-lg max-w-xl leading-relaxed"
                    >
                        Speak directly with our certified consultants to begin your international career journey.
                    </motion.p>
                </div>
            </div>


        </section>
    );
}