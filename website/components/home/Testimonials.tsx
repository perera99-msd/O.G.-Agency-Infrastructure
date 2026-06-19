"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
    {
        name: "Kasun Perera",
        role: "Software Engineer (Dubai)",
        content: "The PWA app made it incredibly easy to track my visa status. I didn't have to call the office once. The blockchain upload gave me peace of mind.",
    },
    {
        name: "Amila Fernando",
        role: "Healthcare Worker (UK)",
        content: "Mr. Wasantha and his team are phenomenal. The AI suggested a role I hadn't even considered, and within 3 weeks my application was processed.",
    },
    {
        name: "Sarah Silva",
        role: "University Student (Australia)",
        content: "Transparent, fast, and entirely digital. Submitting my documents through their secure portal was seamless. Highly recommend O.G. Agency.",
    },
];

export default function Testimonials() {
    return (
        <section className="w-full py-24 bg-main-50 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2>Success Stories</h2>
                    <p className="mx-auto mt-4">Hear from our clients who have successfully relocated.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            whileHover={{ y: -5 }} // Subtle premium hover lift
                            className="bg-white p-8 rounded-2xl shadow-[var(--shadow-card)] border border-main-900/5 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex gap-1 mb-6 text-main-300">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                </div>
                                <p className="text-secondary-900 italic mb-8">&quot;{review.content}&quot;</p>
                            </div>
                            <div className="border-t border-main-900/10 pt-4 mt-auto">
                                <h5 className="text-main-900 text-lg mb-0.5">{review.name}</h5>
                                <p className="text-small m-0">{review.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}