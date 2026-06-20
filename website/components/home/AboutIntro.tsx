"use client";

import { motion } from "framer-motion";
import { Scissors, ShieldCheck, Plane, FileCheck, HeartHandshake, Star } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    num: "01",
    icon: FileCheck,
    title: "Register & Apply",
    desc: "Submit your CV and garment skills profile. Our team will match you to the right vacancy in Romania or Russia.",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Visa & Documentation",
    desc: "We handle your SLBFE clearance, work permit, and employer visa — completely managed for you.",
  },
  {
    num: "03",
    icon: Plane,
    title: "Depart & Arrive",
    desc: "Fly to your destination with confidence. Employer representatives receive you at the airport.",
  },
  {
    num: "04",
    icon: HeartHandshake,
    title: "Settle & Thrive",
    desc: "Move into accommodation, begin work, and start sending money home — with O.G. Agency welfare support ongoing.",
  },
];

const advantages = [
  { icon: Scissors, title: "Garment Industry Specialists", desc: "The only Sri Lankan agency with dedicated Romania and Russia garment placement desks." },
  { icon: Star, title: "SLBFE Licensed & Trusted", desc: "Government licensed bureau (No. 2751) — zero hidden fees, fully transparent processes." },
  { icon: HeartHandshake, title: "Post-Placement Welfare", desc: "We don't disappear after you leave. Monthly welfare calls and 24/7 emergency contact." },
];

export default function AboutIntro() {
  return (
    <section className="w-full bg-white py-24 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,168,232,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="grid lg:grid-cols-2 gap-12 items-end mb-20"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-main-50 border border-main-900/8 mb-7">
              <Scissors size={14} className="text-main-700" />
              <span className="text-[11px] font-bold text-main-900 tracking-[0.2em] uppercase">O.G. Agency — Est. 2012</span>
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-[0.97] tracking-tight text-main-900 mb-0">
              Sri Lanka&apos;s{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-main-700 to-main-500">
                #1 Garment
              </span>
              <br />
              Industry Recruiter.
            </h2>
          </div>
          <div>
            <p className="text-secondary-700 text-base lg:text-lg font-medium leading-relaxed m-0 mb-6">
              For over 12 years, O.G. Agency has been the most trusted bridge between Sri Lankan garment professionals and top employers in Romania, Russia, and beyond. We don&apos;t just find jobs — we build careers and change lives.
            </p>
            <p className="text-secondary-700 text-sm lg:text-base font-medium leading-relaxed m-0">
              Our team of 40+ specialists handle every step — from matching your skills to the right factory, to ensuring your visa is approved, to weekly welfare calls once you&apos;re abroad. You focus on your future. We handle everything else.
            </p>
          </div>
        </motion.div>

        {/* 4-step process */}
        <div className="relative mb-20">
          {/* Connecting line */}
          <div className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-main-900/10 to-transparent hidden lg:block pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease }}
                  className="relative"
                >
                  {/* Number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-main-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="font-heading font-black text-2xl text-main-900/20 tracking-tight">{step.num}</span>
                  </div>
                  <h5 className="text-main-900 font-heading font-black text-lg mb-3 m-0">{step.title}</h5>
                  <p className="text-secondary-600 text-sm font-medium leading-relaxed m-0">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="grid md:grid-cols-3 gap-5"
        >
          {advantages.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex gap-5 p-7 rounded-2xl bg-main-50 border border-main-900/5 hover:bg-main-300/5 hover:border-main-300/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-main-700 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Icon size={22} />
              </div>
              <div>
                <h5 className="text-main-900 font-heading font-black text-base mb-2 m-0">{title}</h5>
                <p className="text-secondary-600 text-sm font-medium leading-relaxed m-0">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}