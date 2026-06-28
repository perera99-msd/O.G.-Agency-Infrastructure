// components/jobs/JobSearch.jsx
"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";

export default function JobSearch({ value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 bg-white border-2 transition-colors duration-200 px-4 py-3 ${
        focused ? "border-[var(--color-main-500)]" : "border-[var(--color-secondary-200)]"
      }`}
      style={{ borderRadius: 0 }}
    >
      <Search
        size={18}
        className={focused ? "text-[var(--color-main-500)]" : "text-[var(--color-secondary-400)]"}
      />
      <input
        type="text"
        placeholder="Search by job title, category, or keyword…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent text-[var(--color-secondary-800)] placeholder:text-[var(--color-secondary-400)] text-sm font-[Inter] outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-[var(--color-secondary-400)] hover:text-[var(--color-secondary-700)] transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}