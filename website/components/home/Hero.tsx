"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Custom easing for ultra-smooth premium feel
const premiumEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEasing } },
};

export default function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-main-50 px-6 overflow-hidden">
            {/* Subtle Premium Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-primary rounded-full blur-[120px] opacity-10 pointer-events-none" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center"
            >
                <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-main-900/5 border border-main-900/10">
                    <span className="w-2 h-2 rounded-full bg-main-500 animate-pulse" />
                    <span className="text-sm font-medium text-main-700 tracking-wide uppercase">Next-Gen Visa Processing</span>
                </motion.div>

                <motion.h1 variants={item} className="mb-6">
                    Your Global Career, <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-primary">Secured & Simplified.</span>
                </motion.h1>

                <motion.p variants={item} className="text-lead mb-10 max-w-2xl mx-auto">
                    Experience the future of manpower recruitment. We leverage blockchain security and AI matching to connect top talent with elite global opportunities.
                </motion.p>

                <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                    <Link href="/services">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-main-900 text-main-50 px-8 py-4 rounded-lg font-medium hover:bg-main-700 transition-all duration-300 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] group">
                            Start Application <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                    <Link href="/contact">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-main-900/20 text-main-900 px-8 py-4 rounded-lg font-medium hover:bg-main-900/5 transition-all duration-300">
                            Speak to an Expert
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}