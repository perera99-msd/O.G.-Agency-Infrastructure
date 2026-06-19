"use client";

import { motion } from "framer-motion";

const approvalData = [
    { region: "Middle East", percentage: 94 },
    { region: "Europe", percentage: 88 },
    { region: "Asia Pacific", percentage: 91 },
];

export default function Stats() {
    return (
        <section className="w-full py-24 bg-main-900 text-main-50 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Large Numbers */}
                <div className="grid grid-cols-2 gap-8">
                    {[
                        { value: "15k+", label: "Visas Approved" },
                        { value: "50+", label: "Destinations" },
                        { value: "98%", label: "Client Satisfaction" },
                        { value: "24h", label: "Processing Start" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="border-l-2 border-main-500 pl-6"
                        >
                            <h2 className="text-main-50 mb-2 text-5xl">{stat.value}</h2>
                            <p className="text-secondary-300 text-sm tracking-wider uppercase m-0">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Animated Bar Chart (Data Viz) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-main-50/5 p-8 rounded-2xl border border-main-50/10 backdrop-blur-sm"
                >
                    <h4 className="text-main-50 mb-8">Visa Success Rates</h4>
                    <div className="flex flex-col gap-6">
                        {approvalData.map((data, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-2 text-secondary-100">
                                    <span>{data.region}</span>
                                    <span className="font-mono">{data.percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-main-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${data.percentage}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                                        className="h-full bg-gradient-secondary rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}