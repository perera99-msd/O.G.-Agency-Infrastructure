// app/jobs/page.jsx
"use client";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useJobFilters } from "@/utils/hooks/useJobFilters";
import JobSearch from "@/components/jobs/JobSearch";
import JobFilters from "@/components/jobs/JobFilters";
import JobGrid from "@/components/jobs/JobGrid";
import JobPagination from "@/components/jobs/JobPagination";

export default function JobsPage() {
  const {
    filters,
    results,
    totalCount,
    totalPages,
    activeFilterCount,
    updateFilter,
    resetFilters,
    setPage,
  } = useJobFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--color-secondary-50)]">
      <div className="bg-main-900 pt-24"></div>
      {/* ── Page Header ── */}
      <div className="bg-[var(--color-main-800)] text-black pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Eyebrow */}
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-main-300)] mb-3">
            OG Agency · Opportunities Abroad
          </p>
          <h1 className="font-[Poppins] font-bold text-3xl md:text-4xl text-black mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-[var(--color-main-200)] text-sm max-w-lg">
            Browse verified foreign employment opportunities across Qatar, UAE, Saudi Arabia, Kuwait, and Malaysia.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-2xl">
            <JobSearch
              value={filters.search}
              onChange={(v) => updateFilter("search", v)}
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <p className="text-sm text-[var(--color-secondary-600)]">
            <span className="font-semibold">{totalCount}</span> jobs found
          </p>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--color-secondary-200)] text-sm text-[var(--color-secondary-700)]"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-[var(--color-main-500)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* ── Sidebar Filters (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <JobFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* ── Job Grid ── */}
          <div className="flex-1 min-w-0">
            <JobGrid jobs={results} totalCount={totalCount} />
            <JobPagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile Filters Drawer ── */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-white z-50 overflow-y-auto shadow-xl lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-secondary-100)]">
              <span className="font-[Poppins] font-semibold text-[var(--color-secondary-800)]">
                Filters
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-[var(--color-secondary-500)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <JobFilters
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
            <div className="p-4 border-t border-[var(--color-secondary-100)]">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[var(--color-main-500)] text-white text-sm font-semibold"
              >
                Show {totalCount} jobs
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
