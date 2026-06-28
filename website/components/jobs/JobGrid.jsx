// components/jobs/JobGrid.jsx
"use client";
import JobCard from "./JobCard";
import { Briefcase } from "lucide-react";

export default function JobGrid({ jobs, totalCount }) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Briefcase size={40} className="text-[var(--color-secondary-200)] mb-4" />
        <p className="font-[Poppins] font-semibold text-[var(--color-secondary-600)] text-lg mb-1">
          No jobs found
        </p>
        <p className="text-sm text-[var(--color-secondary-400)] max-w-xs">
          Try adjusting your filters or search terms to find more opportunities.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-mono text-[var(--color-secondary-400)] uppercase tracking-widest mb-5">
        {totalCount} position{totalCount !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}