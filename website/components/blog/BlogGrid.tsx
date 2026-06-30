"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, Calendar, Tag, Search, Sparkles } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  author: string;
  featured?: boolean;
}

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: "How Automated Fabric Cutting Systems Are Revolutionizing Garment Factories in Poland",
    excerpt: "Modern European apparel manufacturing relies heavily on CAD-driven pattern cutting. See how our candidates at OG Skills Academy adapt quickly to high-precision laser cutters.",
    category: "Garment Factories",
    readTime: "5 min read",
    date: "June 25, 2026",
    image: "/gallery/computerized-cutting.jpg",
    author: "Technical Training Division"
  },
  {
    id: 2,
    title: "Step-by-Step Document Preparation for Romanian Industrial Work Visas",
    excerpt: "Navigating medical certifications, police clearance records, and skill test attestations. Avoid common pitfalls that delay European Union work authorization.",
    category: "Visa & Legal",
    readTime: "8 min read",
    date: "June 20, 2026",
    image: "/gallery/garment-team-pink.jpg",
    author: "Legal Compliance Team"
  },
  {
    id: 3,
    title: "Why High-Speed Juki & Brother Lockstitch Specialists Are in Record Demand",
    excerpt: "An inside look at salary benchmarks, overtime structures, and accommodation benefits for Sri Lankan sewing machine operators across Southeastern Europe.",
    category: "Market Trends",
    readTime: "6 min read",
    date: "June 14, 2026",
    image: "/gallery/sewing-stations.jpg",
    author: "Global Placement Advisory"
  },
  {
    id: 4,
    title: "Inside Our Factory Management Pathway: From Line Supervisor to Quality Manager",
    excerpt: "Career progression stories of O.G. Agency candidates who transitioned from floor operators to supervisory roles in high-volume apparel manufacturing plants.",
    category: "Candidate Stories",
    readTime: "7 min read",
    date: "June 08, 2026",
    image: "/gallery/factory-runway.jpg",
    author: "Alumni Relations"
  },
  {
    id: 5,
    title: "Blockchain & AI in Recruitment: Eliminating Middlemen and Verifying Credentials",
    excerpt: "How our digital ecosystem ensures transparent contract signing, immutable skill records, and direct verified communication between foreign employers and workers.",
    category: "Automation & Tech",
    readTime: "5 min read",
    date: "May 30, 2026",
    image: "/gallery/garment-factory-floor.jpg",
    author: "Digital Infrastructure Lab"
  },
  {
    id: 6,
    title: "Active Apparel & Sportswear Assembly: Precision Quality Standards in Lithuania",
    excerpt: "Detailed inspection methodologies and seam strength testing required by top European activewear brands manufacturing in the Baltic region.",
    category: "Garment Factories",
    readTime: "6 min read",
    date: "May 22, 2026",
    image: "/gallery/sewing-room-active.jpg",
    author: "Quality Assurance Unit"
  }
];

const CATEGORIES = [
  "All Articles",
  "Garment Factories",
  "Visa & Legal",
  "Market Trends",
  "Candidate Stories",
  "Automation & Tech"
];

export default function BlogGrid() {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = INITIAL_BLOGS.filter(post => {
    const matchesCategory = activeCategory === "All Articles" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="articles-grid" className="w-full py-24 bg-main-50 px-6 lg:px-16">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-8 border-b border-main-900/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main-300/20 text-main-700 text-xs font-bold tracking-[0.2em] uppercase mb-3">
              <Sparkles size={14} className="text-main-700" />
              Latest Knowledge Base
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-main-900">
              Explore Articles & <span className="text-main-500">Industry Guides</span>
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-main-900/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, guides..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-main-900/15 text-main-900 text-sm font-medium focus:outline-none focus:border-main-900 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? "bg-main-900 text-white shadow-lg"
                  : "bg-white text-main-900/70 border border-main-900/10 hover:bg-main-300/20 hover:text-main-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Editorial Grid */}
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={post.id}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-main-900/10 shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-64 overflow-hidden bg-main-900/5">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1.5 rounded-xl bg-main-900/90 text-white font-bold text-[10px] tracking-wider uppercase backdrop-blur-md">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="flex flex-col flex-1 p-8">
                    <div className="flex items-center gap-4 text-xs text-main-900/60 font-medium mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-main-500" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-main-500" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-heading font-bold text-main-900 group-hover:text-main-700 transition-colors leading-snug mb-3">
                      {post.title}
                    </h3>

                    <p className="text-main-900/70 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="pt-6 border-t border-main-900/10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-main-900/80">
                        By {post.author}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-main-900 group-hover:translate-x-1 transition-transform duration-300">
                        Read More
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="w-full py-20 text-center bg-white rounded-3xl border border-main-900/10">
              <p className="text-main-900/60 text-lg font-medium">No articles matching your query. Check back soon for automated updates!</p>
            </div>
          )}
        </AnimatePresence>

        {/* Future Automation Banner Note */}
        <div className="mt-16 p-8 rounded-3xl bg-main-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-main-500 text-main-900 text-[10px] font-bold uppercase tracking-wider mb-2">
              AUTOMATION PREPARED
            </span>
            <h4 className="text-2xl font-heading font-bold mb-2">Automated Article Pipeline Sync</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Our automated content ingestion engine will publish verified labor news, visa requirement updates, and interview tips directly into this component grid in real-time.
            </p>
          </div>
          <button
            onClick={() => alert("Automation Webhook Listener Active. Real-time updates will automatically stream into this component grid.")}
            className="px-6 py-3.5 rounded-2xl bg-white text-main-900 font-bold text-xs uppercase tracking-wider hover:bg-main-300 transition-colors shrink-0"
          >
            Check Sync Status
          </button>
        </div>

      </div>
    </section>
  );
}
