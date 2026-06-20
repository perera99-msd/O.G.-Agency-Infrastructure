"use client";

import { motion } from "framer-motion";
import { Heart, Music, ShoppingBag, Home, Users, Smile, ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const lifeCards = [
  {
    icon: Home,
    title: "Comfortable Accommodation",
    desc: "Modern, fully-furnished hostels and worker residences provided by employers — a real home away from home.",
    img: "/home/hostel_room.jpg",
    tag: "🏠 Your Room",
    color: "from-main-900 to-main-700",
  },
  {
    icon: Music,
    title: "Celebrations & Music",
    desc: "Weekends alive with singing, dancing and celebration — forming lifelong bonds with colleagues from across Sri Lanka.",
    img: "/home/hostel_party.jpg",
    tag: "🎉 Weekend Fun",
    color: "from-secondary-900 to-secondary-700",
  },
  {
    icon: ShoppingBag,
    title: "Shopping & Rich Living",
    desc: "Earn well, live better. Explore European malls, send money home, and still afford a lifestyle you're proud of.",
    img: "/home/rich_lifestyle.jpg",
    tag: "🛍️ Spend & Enjoy",
    color: "from-main-700 to-main-500",
  },
];

const lifeMoments = [
  { icon: Users, title: "A Brotherhood & Sisterhood", desc: "Build friendships that last a lifetime with fellow Sri Lankan workers who become your family abroad." },
  { icon: Smile, title: "Cultural Exchange", desc: "Experience European and Eurasian cultures — languages, food, festivals, and traditions unlike anything at home." },
  { icon: Heart, title: "Support at Every Step", desc: "O.G. Agency stays connected after placement — welfare checks, issue resolution, and ongoing support." },
];

export default function LifeAbroad() {
  return (
    <section className="w-full bg-main-50 py-24 px-6 overflow-hidden relative">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,168,232,0.05)_0%,transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(82,121,111,0.05)_0%,transparent_55%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-main-900 mb-6 shadow-sm">
            <Heart size={13} className="text-main-300" />
            <span className="text-[11px] font-bold text-main-50 tracking-[0.2em] uppercase">Life Beyond Work</span>
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-[0.97] tracking-tight text-main-900 mb-5">
            Work Hard.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-main-700 to-secondary-500">
              Live Better.
            </span>
          </h2>
          <p className="text-secondary-700 text-base lg:text-lg font-medium leading-relaxed max-w-2xl mx-auto m-0">
            Our workers don&apos;t just earn — they thrive. See the real life our community
            lives in Romania and Russia: comfort, celebration, friendship, and freedom.
          </p>
        </motion.div>

        {/* Main 3-card row */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {lifeCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
                whileHover={{ y: -8 }}
                className="group relative rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] cursor-pointer"
              >
                {/* Photo */}
                <div className="h-72 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    style={{ transform: "scale(1)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-main-900/95 via-main-900/30 to-transparent" />
                  {/* Tag */}
                  <div className="absolute top-5 left-5 bg-white/15 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-white text-[11px] font-bold">
                    {card.tag}
                  </div>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>
                    <h4 className="text-white font-heading font-black text-lg leading-tight tracking-tight m-0">{card.title}</h4>
                  </div>
                  <p className="text-white/70 text-xs font-medium leading-relaxed m-0">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Wide banner: Hostel Party full bleed */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="relative rounded-[2rem] overflow-hidden h-72 lg:h-96 mb-12 shadow-[0_30px_80px_rgba(0,0,0,0.15)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/hostel_party.jpg" alt="Workers celebrating together" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-main-900/90 via-main-900/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-10 lg:px-16">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-main-300/20 border border-main-300/30 rounded-full px-4 py-2 mb-5">
                <Music size={13} className="text-main-300" />
                <span className="text-main-300 text-[11px] font-bold uppercase tracking-widest">Community Life</span>
              </div>
              <h3 className="text-white font-heading font-black text-3xl lg:text-4xl xl:text-5xl leading-[1.05] tracking-tight mb-4">
                Nights Full of Songs,<br />Weekends Full of Joy.
              </h3>
              <p className="text-white/65 text-sm lg:text-base font-medium leading-relaxed m-0 max-w-md">
                Our worker communities across Romania and Russia celebrate together — Sri Lankan culture thrives abroad through music, food, and friendship.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3 feature boxes */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {lifeMoments.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="bg-white rounded-2xl p-7 shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-main-900/5 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 bg-main-50 rounded-2xl flex items-center justify-center mb-5">
                <Icon size={22} className="text-main-700" />
              </div>
              <h5 className="text-main-900 font-heading font-black text-lg mb-3 m-0">{title}</h5>
              <p className="text-secondary-600 text-sm font-medium leading-relaxed m-0">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Two country food photos side by side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="grid md:grid-cols-2 gap-5"
        >
          {[
            { img: "/home/romania_food.jpg", country: "Romania", flag: "🇷🇴", label: "Romanian Cuisine", desc: "Sarmale, mici, mamaliga — rich and hearty traditional food you'll love." },
            { img: "/home/russia_food.jpg", country: "Russia", flag: "🇷🇺", label: "Russian Cuisine", desc: "Borscht, pelmeni, blini — warming meals perfect for the Eurasian climate." },
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden h-64 group shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt={`${item.country} food`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.flag}</span>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{item.country}</span>
                </div>
                <div>
                  <div className="text-white font-heading font-black text-xl mb-1.5">{item.label}</div>
                  <p className="text-white/65 text-xs font-medium leading-relaxed m-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="mt-12 text-center"
        >
          <p className="text-secondary-600 text-base font-medium mb-6">
            Join 2,751+ Sri Lankan workers living their best life abroad.
          </p>
          <button className="bg-main-900 text-white px-10 py-4.5 rounded-full font-black text-sm tracking-wide hover:bg-main-700 shadow-[0_10px_30px_rgba(0,52,89,0.2)] hover:shadow-[0_15px_40px_rgba(0,52,89,0.3)] hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-3 py-4">
            Start My Journey <ArrowRight size={15} />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
