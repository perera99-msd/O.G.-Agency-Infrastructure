"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ChairmanMessage() {
  const industries = [
    "Garment Manufacturing",
    "Construction",
    "Engineering",
    "Agriculture",
    "Retail",
    "Hospitality",
    "Healthcare",
  ];

  return (
    <section className="py-24 bg-main-50 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait */}
          <div className="md:col-span-5 flex justify-center">
            <FadeUp>
              <div className="relative group">
                {/* Decorative background frame */}
                <div className="absolute inset-4 -bottom-4 -right-4 border border-main-500 rounded-2xl -z-10 group-hover:inset-3 group-hover:-bottom-3 group-hover:-right-3 transition-all duration-300" />
                
                {/* Picture Container */}
                <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden bg-secondary-100 shadow-2xl">
                  <Image
                    src="/managingDirector.png"
                    alt="Mr. Wasantha Chandralal Vithanage - Managing Director"
                    fill
                    sizes="(max-w-768px) 256px, 288px"
                    className="object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-main-950/70 via-transparent to-transparent" />
                  
                  {/* Floating title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-heading font-bold text-base leading-tight">Mr. Wasantha C. Vithanage</p>
                    <p className="text-[10px] font-mono tracking-wider uppercase text-main-300">Managing Director</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right Column: Message */}
          <div className="md:col-span-7 space-y-6">
            <FadeUp>
              <p className="font-mono text-xs tracking-[0.2em] text-main-500 uppercase font-semibold">
                Welcome Message
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-main-900 leading-tight">
                Message from our Managing Director
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="relative text-secondary-700 font-sans text-sm md:text-base leading-relaxed pl-8">
                <Quote className="absolute left-0 top-0 text-main-300 w-6 h-6 rotate-180 transform -translate-x-1" />
                <p className="italic mb-4">
                  "At OG Agency, our commitment is simple yet profound: to deliver the highest standards of competency, ethics, and mutual trust for both foreign employers and candidates. Since 2012, we have focused on bridging skills gaps with absolute professionalism."
                </p>
                <p className="mb-4">
                  We take pride in our expertise in supplying skilled, diligent workforces specifically for key industrial sectors including garment manufacturing, construction, engineering, agriculture, retail, hospitality, and healthcare.
                </p>
                <p>
                  We believe that our success lies in the success of the businesses we support and the livelihood improvements of the professionals we place. We welcome you to experience an agency built on reliability.
                </p>
              </div>
            </FadeUp>

            {/* Focus Industries list */}
            <FadeUp delay={0.15}>
              <div className="pt-6 border-t border-secondary-200/50">
                <p className="font-heading font-semibold text-main-900 text-sm mb-3">
                  Core Industry Focus:
                </p>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <span
                      key={ind}
                      className="px-3 py-1 bg-white border border-secondary-100 hover:border-main-500/30 text-secondary-700 hover:text-main-700 transition-colors text-xs font-medium font-sans rounded-full"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  );
}
