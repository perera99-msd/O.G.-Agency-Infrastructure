"use client";

import { motion } from "framer-motion";
import { Star, Quote, MapPin, ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const stories = [
  {
    name: "Kasun Bandara",
    role: "Sewing Machine Operator",
    destination: "Bucharest, Romania 🇷🇴",
    avatar: "https://i.pravatar.cc/100?img=11",
    content:
      "I was earning LKR 40,000 at home. Now in Romania I earn €950 a month. My family built a house back in Sri Lanka and I'm still saving money. O.G. Agency arranged everything — visa, accommodation, even picked me up from the airport.",
    wage: "€950/mo",
    years: "2 Years",
    rating: 5,
  },
  {
    name: "Nirmali Perera",
    role: "Quality Control Inspector",
    destination: "Moscow, Russia 🇷🇺",
    avatar: "https://i.pravatar.cc/100?img=25",
    content:
      "Working in Russia was my dream. The factory is modern, my hostel is clean and comfortable, and I have dinner with my friends every night. I've saved enough to buy land back home. I couldn't have done this without O.G. Agency.",
    wage: "$1,100/mo",
    years: "18 Months",
    rating: 5,
  },
  {
    name: "Supun Jayasinghe",
    role: "Garment Production Supervisor",
    destination: "Cluj-Napoca, Romania 🇷🇴",
    avatar: "https://i.pravatar.cc/100?img=33",
    content:
      "My biggest worry was about food and language. But the factory has a canteen with rice and curry, and many Sri Lankans are there — it felt like home from day one. I've now been promoted to supervisor. Life is good.",
    wage: "€1,150/mo",
    years: "3 Years",
    rating: 5,
  },
  {
    name: "Dilrukshi Fernando",
    role: "Embroidery Specialist",
    destination: "St. Petersburg, Russia 🇷🇺",
    avatar: "https://i.pravatar.cc/100?img=47",
    content:
      "I sang and danced at our Sri Lanka New Year party in the hostel with 30 colleagues last April. Nobody believed that living in Russia could feel this joyful. Our weekends are like festivals — and we still send money home every month.",
    wage: "$980/mo",
    years: "14 Months",
    rating: 5,
  },
  {
    name: "Roshan Wickramasinghe",
    role: "Cutting Room Technician",
    destination: "Bucharest, Romania 🇷🇴",
    avatar: "https://i.pravatar.cc/100?img=52",
    content:
      "O.G. Agency is genuine. They got me a job at a Zara supplier factory. The pay is fair, overtime is extra, and they gave me accommodation 5 minutes from the factory. I video call my family daily — they are so proud of me.",
    wage: "€880/mo",
    years: "20 Months",
    rating: 5,
  },
  {
    name: "Priyanka Cooray",
    role: "Garment Assembler",
    destination: "Moscow, Russia 🇷🇺",
    avatar: "https://i.pravatar.cc/100?img=61",
    content:
      "I never thought a girl from Gampaha could be shopping in Moscow malls. My salary covers accommodation, food, and I still send LKR 70,000 home monthly. O.G. Agency changed my life and my family's life completely.",
    wage: "$850/mo",
    years: "11 Months",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-main-50 py-24 px-6 overflow-hidden relative">
      {/* Subtle bg texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,232,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-main-900 mb-6">
            <Quote size={13} className="text-main-300" />
            <span className="text-[11px] font-bold text-main-50 tracking-[0.2em] uppercase">Real Stories, Real People</span>
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-[0.97] tracking-tight text-main-900 mb-5">
            Success{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-main-700 to-secondary-500">
              Stories
            </span>
          </h2>
          <p className="text-secondary-700 text-base lg:text-lg font-medium leading-relaxed max-w-2xl mx-auto m-0">
            Hear directly from Sri Lankan garment workers who are now thriving in Romania and Russia —
            their words are our greatest achievement.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {stories.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.1, ease }}
              whileHover={{ y: -6, boxShadow: "0 25px 60px rgba(0,52,89,0.12)" }}
              className="bg-white rounded-[1.75rem] p-7 shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-main-900/5 flex flex-col justify-between transition-all duration-400 cursor-default"
            >
              {/* Top: stars + quote icon */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-0.5">
                    {[...Array(s.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={22} className="text-main-300/30" />
                </div>

                {/* Story */}
                <p className="text-secondary-800 text-sm font-medium leading-relaxed italic mb-6 m-0">
                  &ldquo;{s.content}&rdquo;
                </p>
              </div>

              {/* Bottom: person + wage badge */}
              <div>
                {/* Wage + years badges */}
                <div className="flex gap-2 mb-5">
                  <span className="bg-main-50 border border-main-900/8 text-main-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                    💰 {s.wage}
                  </span>
                  <span className="bg-secondary-50 border border-secondary-900/8 text-secondary-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                    ⏱ {s.years}
                  </span>
                </div>

                <div className="border-t border-main-900/6 pt-4 flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-main-900/10 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-black text-main-900 text-sm leading-none mb-0.5">{s.name}</div>
                    <div className="text-secondary-500 text-[10px] font-bold uppercase tracking-wider truncate">{s.role}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 bg-main-50 rounded-full px-2.5 py-1.5">
                    <MapPin size={10} className="text-main-500" />
                    <span className="text-[9px] font-bold text-main-700 whitespace-nowrap">{s.destination.split(",")[0]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big trust banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="relative bg-main-900 rounded-[2rem] p-8 lg:p-14 overflow-hidden"
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-main-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Worker photo collage — right side */}
          <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 gap-3 h-44">
            {["/home/hostel_party.jpg", "/home/rich_lifestyle.jpg", "/home/hostel_room.jpg"].map((img, i) => (
              <div key={i} className="w-32 rounded-2xl overflow-hidden shadow-lg" style={{ transform: `rotate(${(i - 1) * 3}deg)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Worker life" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-amber-400" fill="currentColor" />)}
              <span className="text-white font-heading font-black text-2xl ml-2">4.9 / 5</span>
              <span className="text-white/40 text-xs ml-2">from 2,751+ workers</span>
            </div>
            <h3 className="text-white font-heading font-black text-3xl lg:text-4xl leading-tight tracking-tight mb-5">
              Join Thousands Who<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-main-300 to-secondary-300">
                Changed Their Lives.
              </span>
            </h3>
            <p className="text-white/55 text-sm lg:text-base font-medium leading-relaxed mb-8 m-0 max-w-md">
              O.G. Agency has been building better futures for Sri Lankan garment workers since 2012.
              Your success story starts with one conversation.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-main-900 px-8 py-4 rounded-full font-black text-sm tracking-wide hover:bg-main-50 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 flex items-center gap-2.5">
                Register Free <ArrowRight size={14} />
              </button>
              <button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-white/15 transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}