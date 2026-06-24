"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

import animationData from "../../public/chatbot-animation/live-chatbot.json";

export default function AIChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const isPlaying = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted || pathname === "/contact") return null;

  const handleMouseEnter = () => {
    if (lottieRef.current && !isPlaying.current) {
      isPlaying.current = true;
      lottieRef.current.goToAndPlay(0, true);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div 
        className="fixed bottom-10 right-8 z-50 cursor-pointer w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl hover:scale-105 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
      >
        {animationData && (
          <Lottie 
            lottieRef={lottieRef}
            animationData={animationData} 
            loop={false} 
            autoplay={false} 
            onDOMLoaded={() => {
              // Jump to frame 0 to ensure it's visible while idle (without surrounding bubbles)
              lottieRef.current?.goToAndStop(0, true);
            }}
            onComplete={() => {
              isPlaying.current = false;
              lottieRef.current?.goToAndStop(0, true);
            }}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Chat Box Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[180px] md:bottom-[200px] right-8 z-50 w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-main-900/10 flex flex-col"
          >
            {/* Header */}
            <div className="bg-main-900 text-main-50 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg">AI Assistant</h3>
                <p className="text-xs text-main-50/70">Online & ready to help</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-main-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-[300px] p-4 flex flex-col gap-4 overflow-y-auto bg-gray-50">
              <div className="bg-main-100/50 text-main-900 p-3 rounded-2xl rounded-tl-sm text-sm self-start max-w-[80%]">
                Hello! I am the O.G. Agency AI assistant. How can I help you today?
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-main-900/5 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-main-900/20 transition-all text-main-900"
              />
              <button className="bg-main-900 text-main-50 p-2 rounded-full hover:bg-main-700 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
