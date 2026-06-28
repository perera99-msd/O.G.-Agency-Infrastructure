// app/jobs/[id]/page.jsx
"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, DollarSign, Clock, Users, Calendar, ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { jobs } from "@/utils/data/jobs";
import { useBookmarks } from "@/utils/hooks/useBookmarks";
import ShareMenu from "@/components/jobs/ShareMenu";
import JobCard from "@/components/jobs/JobCard";

function formatSalary(salary) {
  const fmt = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);
  return `${fmt(salary.min)} – ${fmt(salary.max)} ${salary.currency}`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export default function JobDetailPage({ params }) {
  const { id } = use(params);
  const job = jobs.find((j) => j.id === id);

  const { toggleBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(job.id);
  const days = daysUntil(job.deadline);

  // Related jobs: same category, different job
  const related = jobs
    .filter((j) => j.id !== job.id && j.category === job.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--color-secondary-50)]">
      {/* ── Navbar Background Spacer ── */}
      <div className="bg-main-900 pt-24"></div>

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-[var(--color-secondary-100)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[var(--color-secondary-400)]">
          <Link href="/" className="hover:text-[var(--color-main-500)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-[var(--color-main-500)] transition-colors">
            Find Jobs
          </Link>
          <span>/</span>
          <span
            className={`px-2 py-0.5 text-xs font-mono ${
              CATEGORY_COLORS[job.category] || "bg-gray-100 text-gray-600"
            }`}
          >
            {job.category}
          </span>
          <span>/</span>
          <span className="text-[var(--color-secondary-700)] truncate max-w-xs">
            {job.title}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-secondary-500)] hover:text-[var(--color-main-500)] transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to jobs
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Hero card */}
            <div className="bg-white border border-[var(--color-secondary-100)] p-6 md:p-8 mb-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
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
                {job.tags
                  .filter((t) => t !== "URGENT" && t !== job.category.toUpperCase())
                  .map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[var(--color-secondary-100)] text-[var(--color-secondary-500)]"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Title */}
              <h1 className="font-[Poppins] font-bold text-2xl md:text-3xl text-[var(--color-secondary-900)] mb-5 leading-tight">
                {job.title}
              </h1>

              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-[var(--color-secondary-100)]">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-secondary-400)] mb-1">
                    Location
                  </p>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[var(--color-main-500)]" />
                    <span className="text-sm font-medium text-[var(--color-secondary-800)]">
                      {job.country}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-secondary-400)] mb-1">
                    Salary
                  </p>
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={13} className="text-[var(--color-main-500)]" />
                    <span className="text-sm font-semibold text-[var(--color-secondary-800)]">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-secondary-400)] mb-1">
                    Deadline
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Clock
                      size={13}
                      className={days <= 7 ? "text-amber-500" : "text-[var(--color-main-500)]"}
                    />
                    <span
                      className={`text-sm font-medium ${
                        days <= 7
                          ? "text-amber-600"
                          : "text-[var(--color-secondary-800)]"
                      }`}
                    >
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-secondary-400)] mb-1">
                    Posted
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[var(--color-main-500)]" />
                    <span className="text-sm text-[var(--color-secondary-700)]">
                      {formatDate(job.postedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Apply CTA */}
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-[var(--color-main-700)] text-white text-sm font-semibold hover:bg-[var(--color-main-800)] transition-colors flex items-center gap-2">
                  Apply Now
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => toggleBookmark(job.id)}
                  className={`px-4 py-3 border text-sm font-medium flex items-center gap-2 transition-colors ${
                    saved
                      ? "border-[var(--color-main-400)] text-[var(--color-main-600)] bg-[var(--color-main-50)]"
                      : "border-[var(--color-secondary-200)] text-[var(--color-secondary-600)] hover:border-[var(--color-main-300)]"
                  }`}
                >
                  <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Saved" : "Save job"}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-[var(--color-secondary-100)] p-6 md:p-8 mb-6">
              <h2 className="font-[Poppins] font-semibold text-[var(--color-secondary-800)] text-lg mb-4">
                About this role
              </h2>
              <p className="text-sm text-[var(--color-secondary-600)] leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-[var(--color-secondary-100)] p-6 md:p-8 mb-6">
              <h2 className="font-[Poppins] font-semibold text-[var(--color-secondary-800)] text-lg mb-4">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-secondary-600)]">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-[var(--color-main-500)] rounded-full" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white border border-[var(--color-secondary-100)] p-6 md:p-8">
              <h2 className="font-[Poppins] font-semibold text-[var(--color-secondary-800)] text-lg mb-5">
                What you'll receive
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-[var(--color-main-400)] pl-4 py-1"
                  >
                    <p className="text-sm font-semibold text-[var(--color-secondary-800)] mb-0.5">
                      {b.title}
                    </p>
                    <p className="text-xs text-[var(--color-secondary-500)] leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-5">
            {/* Requirements panel */}
            <div className="bg-white border border-[var(--color-secondary-100)] p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-secondary-400)] mb-4">
                Requirements
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-secondary-500)]">Gender</span>
                  <span className="font-medium text-[var(--color-secondary-800)]">
                    {job.genderPreference}
                  </span>
                </div>
                <div className="w-full h-px bg-[var(--color-secondary-100)]" />
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-secondary-500)]">Age Range</span>
                  <span className="font-medium text-[var(--color-secondary-800)]">
                    {job.ageRange.min} – {job.ageRange.max}
                  </span>
                </div>
                <div className="w-full h-px bg-[var(--color-secondary-100)]" />
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-secondary-500)]">Closes in</span>
                  <span
                    className={`font-semibold ${
                      days <= 7 ? "text-amber-600" : "text-[var(--color-secondary-800)]"
                    }`}
                  >
                    {days === 0 ? "Today" : `${days} day${days !== 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white border border-[var(--color-secondary-100)] p-5">
              <ShareMenu job={job} />
            </div>

            {/* Need help? */}
            <div className="bg-[var(--color-main-800)] text-white p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-main-300)] mb-2">
                Need help?
              </p>
              <p className="text-sm text-[var(--color-main-100)] leading-relaxed mb-3">
                Speak with our team about this position before you apply.
              </p>
              <Link
                href="/contact"
                className="inline-block text-sm font-semibold text-white underline underline-offset-2 hover:text-[var(--color-main-200)] transition-colors"
              >
                Contact us →
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Related Jobs ── */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-[Poppins] font-semibold text-[var(--color-secondary-800)] text-lg">
                More {job.category} roles
              </h2>
              <Link
                href={`/jobs?category=${job.category}`}
                className="text-xs text-[var(--color-main-500)] hover:underline underline-offset-2"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}