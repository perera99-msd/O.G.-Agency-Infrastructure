"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, ExternalLink } from "lucide-react";

import animationData from "../../public/chatbot-animation/live-chatbot.json";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  provider?: string;
}

const QUICK_PROMPTS = [
  "What documents do I need for a visa?",
  "How does the recruitment process work?",
  "What are your office hours and address?",
  "What industries do you recruit for?"
];

/*
  Typography scale used throughout this component (kept deliberately small
  and consistent — this is a compact widget, not a page):
  - 10px  → eyebrow / meta labels (uppercase, tracked)
  - 11px  → secondary text (timestamps, subtitle, quick-prompt buttons)
  - 12.5px → body copy (message text, input) — the base size
  - 13px  → in-message sub-headings (##, ###) and widget title
*/

function parseInline(text: string, isUser: boolean): React.ReactNode[] {
  // Regex to match markdown links [label](url), bold **bold**, raw URLs https://..., and emails
  const combinedRegex = /(\[.*?\]\((?:https?:\/\/[^\s\)]+|mailto:[^\s\)]+|tel:[^\s\)]+)\)|\*\*.*?\*\*|https?:\/\/[^\s\),]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?\d[\d\s-]{8,}\d)/g;

  const parts = text.split(combinedRegex);
  return parts.map((part, index) => {
    if (!part) return null;

    // Markdown link: [label](url)
    const mdLinkMatch = part.match(/^\[(.*?)\]\(((?:https?:\/\/[^\s\)]+|mailto:[^\s\)]+|tel:[^\s\)]+))\)$/);
    if (mdLinkMatch) {
      const [, label, url] = mdLinkMatch;
      return (
        <a
          key={index}
          href={url}
          target={url.startsWith("http") ? "_blank" : undefined}
          rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
          className={
            isUser
              ? "underline font-semibold text-white hover:text-white/80 transition-colors break-words inline-flex items-center gap-1"
              : "underline font-semibold text-main-900 hover:text-main-700 transition-colors break-words inline-flex items-center gap-1"
          }
        >
          <span>{label}</span>
          {url.startsWith("http") && <ExternalLink size={12} className="inline opacity-80" />}
        </a>
      );
    }

    // Bold text: **bold**
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={index} className={`font-bold ${isUser ? "text-white" : "text-slate-900"}`}>
          {boldMatch[1]}
        </strong>
      );
    }

    // Raw URL: https://...
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isUser
              ? "underline font-medium text-white hover:text-white/80 transition-colors break-words inline-flex items-center gap-1"
              : "underline font-medium text-main-900 hover:text-main-700 transition-colors break-words inline-flex items-center gap-1"
          }
        >
          <span>{part}</span>
          <ExternalLink size={12} className="inline opacity-80" />
        </a>
      );
    }

    // Email link: user@domain.com
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          className={
            isUser
              ? "underline font-medium text-white hover:text-white/80 transition-colors break-words"
              : "underline font-medium text-main-900 hover:text-main-700 transition-colors break-words"
          }
        >
          {part}
        </a>
      );
    }

    return <span key={index} className={isUser ? "text-white" : "text-slate-800"}>{part}</span>;
  });
}

function FormattedMessageContent({ text, isUser }: { text: string; isUser: boolean }) {
  const lines = text.split("\n");

  return (
    <div className={`space-y-1.5 leading-relaxed text-sm ${isUser ? "text-white" : "text-slate-800"}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Bullet item: - or *
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <div key={lineIdx} className={`flex items-start gap-2 pl-1 my-0.5 ${isUser ? "text-white" : "text-slate-800"}`}>
              <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isUser ? "bg-white" : "bg-main-900"}`} />
              <div className="flex-1 min-w-0">{parseInline(content, isUser)}</div>
            </div>
          );
        }

        // Numbered list: 1. 2. etc.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const [, num, content] = numMatch;
          return (
            <div key={lineIdx} className={`flex items-start gap-2 pl-1 my-0.5 ${isUser ? "text-white" : "text-slate-800"}`}>
              <span className={`font-mono text-sm font-bold flex-shrink-0 mt-0.5 ${isUser ? "text-white" : "text-main-900"}`}>
                {num}.
              </span>
              <div className="flex-1 min-w-0">{parseInline(content, isUser)}</div>
            </div>
          );
        }

        // Header: ### or ##
        if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
          const headerText = trimmed.replace(/^#{2,3}\s+/, "");
          return (
            <h4 key={lineIdx} className={`font-heading font-bold text-sm mt-2 mb-1 ${isUser ? "text-white" : "text-slate-900"}`}>
              {parseInline(headerText, isUser)}
            </h4>
          );
        }

        // Standard paragraph line
        return (
          <p key={lineIdx} className={`break-words text-sm ${isUser ? "text-white" : "text-slate-800"}`}>
            {parseInline(line, isUser)}
          </p>
        );
      })}
    </div>
  );
}

export default function AIChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-greeting",
      sender: "assistant",
      text: "Hello! I am the O.G. Agency AI assistant. How can I help you with our recruitment, visas, or overseas placement today?"
    }
  ]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isPlaying = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  if (!mounted || pathname === "/contact") return null;

  const handleMouseEnter = () => {
    if (lottieRef.current && !isPlaying.current) {
      isPlaying.current = true;
      lottieRef.current.goToAndPlay(0, true);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMessageId, sender: "user", text: messageText }
    ];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:4000/api/chat";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: messageText })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: data.reply || "I am currently unable to provide a response. Please contact our support team.",
          provider: data.provider
        }
      ]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "assistant",
          text: "We are currently having trouble connecting to our AI server. You can also reach our recruitment team directly at info@ogagency.lk or call +94 112 476 348 (WhatsApp: +94 776 636 64)."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
              // Jump to frame 0 to ensure it's visible while idle
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
            className="fixed bottom-[140px] md:bottom-[160px] right-6 md:right-8 z-50 w-[90vw] max-w-[390px] h-[540px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-main-900/10 flex flex-col"
          >
            {/* Header */}
            <div className="bg-main-900 text-main-50 px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-3 h-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm leading-tight text-main-50 flex items-center gap-1.5">
                    O.G. AI Assistant
                    <Sparkles size={14} className="text-amber-400" />
                  </h3>
                  <p className="text-xs text-main-50/70 mt-0.5">Verified recruitment knowledge base</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-main-700 rounded-full transition-colors text-main-50/80 hover:text-main-50"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 px-4 py-3.5 flex flex-col gap-3 overflow-y-auto bg-slate-50/80">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`px-4 py-3 rounded-2xl max-w-[88%] shadow-xs text-sm ${
                    msg.sender === "user"
                      ? "bg-main-900 text-white self-end rounded-br-xs"
                      : "bg-white text-slate-800 self-start rounded-tl-xs border border-slate-200/80"
                  }`}
                >
                  <FormattedMessageContent text={msg.text} isUser={msg.sender === "user"} />
                </div>
              ))}

              {/* Quick suggestions if only 1 message */}
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-col gap-1.5 my-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                    Suggested Questions
                  </p>
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-sm leading-snug bg-white hover:bg-main-50 hover:text-main-900 text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all shadow-2xs cursor-pointer"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div className="bg-white text-slate-600 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-sm self-start border border-slate-200/80 flex items-center gap-2 shadow-xs">
                  <Loader2 size={14} className="animate-spin text-main-900" />
                  <span>Searching knowledge base & generating answer...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about visas, jobs, process..."
                disabled={isLoading}
                className="flex-1 text-sm bg-slate-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-main-900/20 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-main-900 text-main-50 p-2.5 rounded-full hover:bg-main-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}