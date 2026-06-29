// components/jobs/JobCardList.jsx
"use client";
import Link from "next/link";
import { MapPin, DollarSign, Clock, Bookmark, ChevronRight } from "lucide-react";
import { useBookmarks } from "@/utils/hooks/useBookmarks";

function formatSalary(salary) {
  const fmt = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);
  return `${fmt(salary.min)} – ${fmt(salary.max)}`;
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const CATEGORY_COLORS = {
  Garment:       "bg-rose-50 text-rose-600",
  Construction:  "bg-amber-50 text-amber-600",
  Healthcare:    "bg-emerald-50 text-emerald-700",
  Hospitality:   "bg-sky-50 text-sky-600",
  Manufacturing: "bg-violet-50 text-violet-600",
  IT:            "bg-blue-50 text-blue-600",
};

export default function JobCardList({ job }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(job.id);
  const days = daysUntil(job.deadline);
  const isExpiringSoon = days <= 7 && days > 0;

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <article className="relative bg-white border border-secondary-100 hover:border-main-400 hover:shadow-md transition-all duration-200 flex items-center gap-4 px-5 py-4">

        {/* Urgent left stripe */}
        {job.isUrgent && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-main-500" />
        )}

        {/* Category colour dot */}
        <div className={`hidden sm:flex flex-shrink-0 w-10 h-10 items-center justify-center text-[10px] font-bold font-mono uppercase ${CATEGORY_COLORS[job.category] || "bg-gray-100 text-gray-600"}`}>
          {job.category.slice(0, 2)}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {job.isUrgent && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-main-500 text-white">
                URGENT
              </span>
            )}
            <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 ${CATEGORY_COLORS[job.category] || "bg-gray-100 text-gray-600"}`}>
              {job.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-semibold text-secondary-800 text-sm leading-snug group-hover:text-main-600 transition-colors truncate mb-2">
            {job.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 text-xs text-secondary-500">
              <MapPin size={11} className="flex-shrink-0" />
              {job.country}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-secondary-700">
              <DollarSign size={11} className="flex-shrink-0" />
              {formatSalary(job.salary)}
            </span>
            <span className={`flex items-center gap-1 text-xs ${
              days === 0
                ? "text-red-500 font-medium"
                : isExpiringSoon
                ? "text-amber-600 font-medium"
                : "text-secondary-400"
            }`}>
              <Clock size={11} className="flex-shrink-0" />
              {days === 0
                ? "Closes today"
                : isExpiringSoon
                ? `Closes in ${days}d`
                : `Closes ${new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
            </span>
          </div>
        </div>

        {/* Right: bookmark + arrow */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(job.id);
            }}
            aria-label={saved ? "Remove bookmark" : "Save job"}
            className={`p-1.5 transition-colors ${
              saved
                ? "text-main-500"
                : "text-secondary-300 hover:text-main-400"
            }`}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          </button>
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase text-main-500 group-hover:text-main-700 transition-colors">
            View <ChevronRight size={12} />
          </span>
        </div>
      </article>
    </Link>
  );
}