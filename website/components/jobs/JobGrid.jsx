// components/jobs/JobGrid.jsx
"use client";
import { useState } from "react";
import { Briefcase } from "lucide-react";
import JobCard from "./JobCard";
import JobCardList from "./JobCardList";

export default function JobGrid({ jobs, totalCount, viewMode }) {
  const [view, setView] = useState("grid"); // "grid" | "list"

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Briefcase size={40} className="text-secondary-200 mb-4" />
        <p className="font-heading font-semibold text-secondary-600 text-lg mb-1">
          No jobs found
        </p>
        <p className="text-sm text-secondary-400 max-w-xs">
          Try adjusting your filters or search terms to find more opportunities.
        </p>
      </div>
    );
  }

  return (
    <div>


      {/* ── Grid view ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && (
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <JobCardList key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
};