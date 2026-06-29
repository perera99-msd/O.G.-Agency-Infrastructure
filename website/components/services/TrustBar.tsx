// components/services/TrustBar.tsx
"use client";

import { motion } from "framer-motion";
import { Globe, Users, Clock, Star } from "lucide-react";

const stats = [
  { icon: Globe, value: "30+", label: "Countries Served" },
  { icon: Users, value: "10,000+", label: "Successful Placements" },
  { icon: Clock, value: "45 Days", label: "Average Time to Hire" },
  { icon: Star, value: "98%", label: "Client Satisfaction" },
];

export default function TrustBar() {
  return (
    <section className="py-12 px-6 bg-white border-y border-secondary-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <stat.icon className="w-8 h-8 text-main-500 mb-2" />
              <span className="text-3xl md:text-4xl font-bold font-heading text-main-700">
                {stat.value}
              </span>
              <span className="text-sm text-secondary-600 font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}