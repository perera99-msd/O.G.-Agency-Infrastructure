// app/jobs/page.jsx
"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X, Bookmark, LayoutGrid, List } from "lucide-react";
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
  const [viewMode, setViewMode] = useState("grid");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-secondary-50">

    {/* ── Navbar Background Spacer ── */}
      <div className="bg-main-900 pt-24"></div>

      {/* ── Dark hero — pt-[100px] clears the fixed navbar ── */}
      {/* <div className="pt-[100px] pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-widest text-main-300 mb-3">
            O.G. Agency · Opportunities Abroad
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-main-200 text-sm max-w-lg">
            Browse verified foreign employment opportunities across Qatar, UAE,
            Saudi Arabia, Kuwait, and Malaysia.
          </p>
        </div>
      </div> */}

      {/* ── Sticky search bar ── */}
      <div className={`px-4 py-4 sticky z-30 transition-all duration-500 ${scrolled ? "top-[80px]" : "top-[96px]"}`}>
        <div className="max-w-[1440px] mx-auto flex gap-4 items-center">
          <div className="flex-1">
            <JobSearch
              value={filters.search}
              onChange={(v) => updateFilter("search", v)}
              scrolled={scrolled}
            />
          </div>
          {/* My Jobs Button */}
          <button
            onClick={() => updateFilter("savedOnly", !filters.savedOnly)}
            className={`hidden md:flex items-center gap-2 px-5 py-3 border rounded-md text-sm font-medium transition-all duration-500 ${
              filters.savedOnly 
                ? "bg-main-900 border-main-900 text-white shadow-sm" 
                : scrolled 
                  ? "bg-white/70 backdrop-blur-md shadow-sm border-main-900/5 text-secondary-600 hover:text-main-600 hover:border-main-400"
                  : "bg-white border-secondary-200 text-secondary-600 hover:text-main-600 hover:border-main-400"
            }`}
          >
            <Bookmark size={18} fill={filters.savedOnly ? "currentColor" : "none"} />
            Saved Jobs
          </button>

          {/* View toggle */}
          <div className={`hidden md:flex items-center border border-secondary-200 overflow-hidden rounded-md h-full transition-all duration-500 ${scrolled ? "bg-white/70 backdrop-blur-md shadow-sm border-main-900/5" : "bg-white"}`}>
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`p-3 transition-colors ${
                viewMode === "grid"
                  ? "bg-main-900 text-white"
                  : "text-secondary-400 hover:text-secondary-700 hover:bg-secondary-50"
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <div className="w-px h-full bg-secondary-200" />
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`p-3 transition-colors ${
                viewMode === "list"
                  ? "bg-main-900 text-white"
                  : "text-secondary-400 hover:text-secondary-700 hover:bg-secondary-50"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1440px] mx-auto px-4 py-8">

        {/* Mobile filter toggle */}
{/* Mobile filter toggle row — replace the existing div with this */}
<div className="flex items-center justify-end mb-4 lg:hidden">
  <div className="flex items-center gap-2">
    {/* My Jobs — mobile */}
    <button
      onClick={() => updateFilter("savedOnly", !filters.savedOnly)}
      className={`flex items-center gap-1.5 px-3 py-2 border text-sm font-medium transition-colors ${
        filters.savedOnly
          ? "bg-main-900 border-main-900 text-white"
          : "bg-white border-secondary-200 text-secondary-600"
      }`}
    >
      <Bookmark size={14} fill={filters.savedOnly ? "currentColor" : "none"} />
      Saved Jobs
    </button>
    {/* Existing filters button */}
    <button
      onClick={() => setMobileFiltersOpen(true)}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-secondary-200 text-sm text-secondary-700"
    >
      <SlidersHorizontal size={14} />
      Filters
      {activeFilterCount > 0 && (
        <span className="w-5 h-5 bg-main-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {activeFilterCount}
        </span>
      )}
    </button>
  </div>
</div>

        <div className="flex gap-6">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-[160px] pb-8 self-start">
            <JobFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Job grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <p className="text-sm text-secondary-600">
                <span className="font-semibold">{totalCount}</span> positions found
              </p>
            </div>
            <JobGrid jobs={results} totalCount={totalCount} viewMode={viewMode} />
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
            <div className="flex items-center justify-between p-4 border-b border-secondary-100">
              <span className="font-heading font-semibold text-secondary-800">
                Filters
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-secondary-500"
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
            <div className="p-4 border-t border-secondary-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-main-900 text-white text-sm font-semibold rounded-full"
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