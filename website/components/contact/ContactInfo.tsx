"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Mail, MapPin, Printer } from "lucide-react";

// Reusable scroll-fade-up wrapper
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
        >
            {children}
        </motion.div>
    );
}

export default function ContactInfo() {
    const profiles = [
        {
            name: "Mr. Wasantha Chandralal Vithanage",
            role: "Managing Director",
            image: "/managingDirector.png",
            location: "Sri Lanka",
            phones: ["+94 776 636 64"],
            email: "ogwasantha@gmail.com",
        },
        {
            name: "Mr. Gamini Ranasinghe",
            role: "Head of Administrative — Consultant",
            initials: "GR",
            location: "Sri Lanka",
            phones: ["+94 776 029 00"," ", "+94 765 271 747"],
            email: "g_ranasinghe_8@yahoo.com",
        },
    ];

    return (
        <section className="py-24 bg-main-50 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">

                {/* Section header */}
                <FadeUp>
                    <div className="mb-16 border-b border-secondary-100 pb-8">
                        <p className="font-mono text-xs tracking-[0.18em] text-secondary-500 uppercase mb-3">
                            Key Contacts
                        </p>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-main-900 leading-tight max-w-xl">
                            Speak directly with our leadership
                        </h2>
                    </div>
                </FadeUp>

                {/* Office line — plain, no pinging dots */}
                <FadeUp delay={0.08}>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-16 text-base font-sans text-secondary-700">
                        <span className="font-heading font-semibold text-main-900 text-lg">
                            Co-operative Office
                        </span>
                        <a
                            href="tel:+94112476348"
                            className="flex items-center gap-2.5 hover:text-main-500 transition-colors"
                        >
                            <Phone size={16} strokeWidth={1.5} className="text-main-500" />
                            <span className="font-mono">+94 112 476 348</span>
                        </a>
                        <span className="flex items-center gap-2.5 text-secondary-500">
                            <Printer size={16} strokeWidth={1.5} className="text-main-500" />
                            <span className="font-mono">+94 112 476 348</span>
                        </span>
                        <span className="flex items-center gap-2.5 text-secondary-500">
                            <Mail size={16} strokeWidth={1.5} className="text-main-500" />
                            <span className="font-mono">info@ogagency.lk</span>
                        </span>
                    </div>
                </FadeUp>

                {/* Profile cards — left border rule instead of shadow card */}
                <div className="flex flex-col gap-12">
                    {profiles.map((profile, index) => (
                        <FadeUp key={profile.name} delay={index * 0.1}>
                            <div className="flex flex-col md:flex-row items-start gap-8 pl-6 border-l-2 border-secondary-100">

                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-secondary-100">
                                        {profile.image ? (
                                            <Image
                                                src={profile.image}
                                                alt={profile.name}
                                                fill
                                                sizes="112px"
                                                className="object-cover object-center"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-main-700 flex items-center justify-center text-main-50 font-heading font-bold text-2xl">
                                                {profile.initials}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-grow space-y-5">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-heading font-bold text-main-900 leading-tight mb-1">
                                            {profile.name}
                                        </h3>
                                        <p className="font-sans text-sm text-secondary-500 font-medium">
                                            {profile.role}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-xs text-secondary-400 mt-1 font-mono">
                                            <MapPin size={11} strokeWidth={1.5} />
                                            {profile.location}
                                        </p>
                                    </div>

                                    {/* Contact details as a clean definition list */}
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                        <div>
                                            <dt className="font-mono text-[10px] tracking-widest text-secondary-400 uppercase mb-1">Email</dt>
                                            <dd>
                                                <a
                                                    href={`mailto:${profile.email}`}
                                                    className="font-mono text-main-900 hover:text-main-500 transition-colors"
                                                >
                                                    {profile.email}
                                                </a>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-mono text-[10px] tracking-widest text-secondary-400 uppercase mb-1">Phone</dt>
                                            <dd className="space-y-1">
                                                {profile.phones.map((phone) => (
                                                    <a
                                                        key={phone}
                                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                                        className="font-mono text-main-900 hover:text-main-500 transition-colors block"
                                                    >
                                                        {phone}
                                                    </a>
                                                ))}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    );
}