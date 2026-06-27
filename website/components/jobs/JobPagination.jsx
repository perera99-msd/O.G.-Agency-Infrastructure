// components/jobs/JobPagination.jsx
"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JobPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const btnBase =
    "flex items-center justify-center w-9 h-9 text-sm font-medium transition-colors border";
  const active =
    "bg-[var(--color-main-500)] text-white border-[var(--color-main-500)]";
  const inactive =
    "bg-white text-[var(--color-secondary-600)] border-[var(--color-secondary-200)] hover:border-[var(--color-main-400)] hover:text-[var(--color-main-500)]";
  const disabled =
    "bg-white text-[var(--color-secondary-200)] border-[var(--color-secondary-100)] cursor-not-allowed";

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10"
      aria-label="Pagination"
    >
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? disabled : inactive}`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-[var(--color-secondary-400)] text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${page === currentPage ? active : inactive}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? disabled : inactive}`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}