"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
        >
            {children}
        </motion.div>
    );
}

export default function MapView() {
    const latitude = 6.9604331;
    const longitude = 80.0102652;


    const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    return (
        <section className="py-24 bg-main-50 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">

                {/* Section header */}
                <FadeUp>
                    <div className="mb-16 border-b border-secondary-100 pb-8">
                        <p className="font-mono text-[10px] tracking-[0.18em] text-secondary-500 uppercase mb-3">
                            Geography & Navigation
                        </p>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <h2 className="text-3xl md:text-5xl font-heading font-bold text-main-900 leading-tight max-w-xl">
                                Locate Our Office
                            </h2>
                            <div className="flex flex-col gap-2 min-w-[220px]">
                                <div className="flex justify-between items-center border-b border-secondary-100/50 pb-1">
                                    <span className="font-mono text-[10px] tracking-[0.18em] text-secondary-400 uppercase">Weekdays</span>
                                    <span className="text-secondary-900 font-sans text-sm">8:00 AM – 5:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-secondary-100/50 pb-1">
                                    <span className="font-mono text-[10px] tracking-[0.18em] text-secondary-400 uppercase">Saturday</span>
                                    <span className="text-secondary-900 font-sans text-sm">9:00 AM – 1:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-[10px] tracking-[0.18em] text-secondary-400 uppercase">Sunday</span>
                                    <span className="text-secondary-900 font-sans text-sm">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeUp>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                    {/* Address column */}
                    <FadeUp delay={0.05}>
                        <div className="pl-5 border-l-2 border-secondary-100 space-y-6">
                            <div>
                                <p className="font-mono text-[10px] tracking-[0.18em] text-secondary-400 uppercase mb-3">
                                    Registered Address
                                </p>
                                <address className="not-italic text-secondary-900 font-sans text-sm leading-loose">
                                    OG Agency<br />
                                    No. 586/3, Walgama,<br />
                                    Nagahawatta Malwana,<br />
                                    Western Province,<br />
                                    Sri Lanka.
                                </address>
                            </div>

                            <div className="flex items-start gap-2 text-xs text-secondary-500 font-mono">
                                <MapPin size={12} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-main-500" />
                                <span>{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                            </div>

                            <div className="space-y-2 pt-2">
                                <a
                                    href={directionsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-heading font-semibold text-main-900 hover:text-main-500 transition-colors group"
                                >
                                    <Navigation size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    Get Directions
                                </a>
                                <a
                                    href={externalMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-mono text-secondary-500 hover:text-main-500 transition-colors"
                                >
                                    Open in Google Maps
                                    <ExternalLink size={11} />
                                </a>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Map */}
                    <FadeUp delay={0.1}>
                        <div className="lg:col-span-2 overflow-hidden w-full rounded-xl" style={{ height: "380px", width: "680px" }}>
                            <iframe
                                title="OG Agency Headquarters"
                                src={embedUrl}
                                className="w-full h-full border-0 grayscale-[20%]"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </FadeUp>
                </div>
            </div>
        </section>
    );
}