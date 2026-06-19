"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe2 } from "lucide-react";

const features = [
    { icon: ShieldCheck, title: "Blockchain Secured", desc: "Your documents are encrypted and safely stored." },
    { icon: Zap, title: "AI Matchmaking", desc: "Instantly match your CV with the perfect global role." },
    { icon: Globe2, title: "Global Reach", desc: "Partnerships spanning over 50+ tier-one countries." },
];

export default function AboutIntro() {
    return (
        <section className="w-full py-24 bg-white px-6">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="mb-6">Modernizing the <br />Manpower Industry.</h2>
                    <p className="mb-6">
                        For over a decade, O.G. Agency has been the bridge between local talent and international success. We realized that traditional paper-based visa processing was slow and prone to errors.
                    </p>
                    <p className="mb-8">
                        That is why we built a custom digital infrastructure. From AI-driven passport verification to our transparent customer tracking portal, we put power and clarity back into your hands.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="grid gap-6"
                >
                    {features.map((feat, idx) => (
                        <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-main-50 hover:bg-main-300/5 border border-main-900/5 transition-colors duration-300">
                            <div className="w-12 h-12 rounded-full bg-main-100 flex items-center justify-center text-main-500 shrink-0">
                                <feat.icon size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl mb-1">{feat.title}</h4>
                                <p className="text-small m-0">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}