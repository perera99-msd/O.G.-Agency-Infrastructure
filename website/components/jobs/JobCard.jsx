// components/jobs/JobCard.jsx
"use client";
import Link from "next/link";
import { MapPin, DollarSign, Clock, Bookmark } from "lucide-react";
import { useBookmarks } from "@/utils/hooks/useBookmarks";

function formatSalary(salary) {
  const fmt = (n) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  return `${fmt(salary.min)} – ${fmt(salary.max)}`;
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const CATEGORY_COLORS = {
  Garment: "bg-rose-50 text-rose-600",
  Construction: "bg-amber-50 text-amber-600",
  Healthcare: "bg-emerald-50 text-emerald-700",
  Hospitality: "bg-sky-50 text-sky-600",
  Manufacturing: "bg-violet-50 text-violet-600",
  IT: "bg-blue-50 text-blue-600",
};

export default function JobCard({ job }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(job.id);
  const days = daysUntil(job.deadline);
  const isExpiringSoon = days <= 7 && days > 0;

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <article className="relative bg-white border border-[var(--color-secondary-100)] hover:border-[var(--color-main-400)] hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Urgent stripe */}
        {job.isUrgent && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-main-500)]" />
        )}

        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Top row: tags + bookmark */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {job.isUrgent && (
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[var(--color-main-500)] text-white">
                  URGENT
                </span>
              )}
              <span
                className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                  CATEGORY_COLORS[job.category] || "bg-gray-100 text-gray-600"
                }`}
              >
                {job.category}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleBookmark(job.id);
              }}
              aria-label={saved ? "Remove bookmark" : "Save job"}
              className={`flex-shrink-0 p-1 transition-colors ${
                saved
                  ? "text-[var(--color-main-500)]"
                  : "text-[var(--color-secondary-300)] hover:text-[var(--color-main-400)]"
              }`}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-[Poppins] font-semibold text-[var(--color-secondary-800)] text-base leading-snug group-hover:text-[var(--color-main-600)] transition-colors line-clamp-2">
            {job.title}
          </h3>

          {/* Meta */}
          <div className="flex flex-col gap-1.5 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary-500)]">
              <MapPin size={12} className="flex-shrink-0" />
              <span>{job.country}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary-500)]">
              <DollarSign size={12} className="flex-shrink-0" />
              <span className="font-medium text-[var(--color-secondary-700)]">
                {formatSalary(job.salary)}
              </span>
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs ${
                isExpiringSoon
                  ? "text-amber-600 font-medium"
                  : days === 0
                  ? "text-red-500 font-medium"
                  : "text-[var(--color-secondary-400)]"
              }`}
            >
              <Clock size={12} className="flex-shrink-0" />
              <span>
                {days === 0
                  ? "Closes today"
                  : isExpiringSoon
                  ? `Closes in ${days} day${days > 1 ? "s" : ""}`
                  : `Closes ${new Date(job.deadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}`}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-5 pb-4">
          <span className="text-xs font-medium text-[var(--color-main-500)] group-hover:underline underline-offset-2">
            View details →
          </span>
        </div>
      </article>
    </Link>
  );
}