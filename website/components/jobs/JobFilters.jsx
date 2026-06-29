// components/jobs/JobFilters.jsx
"use client";
import { X } from "lucide-react";
import { COUNTRIES, CATEGORIES, GENDER_OPTIONS } from "@/utils/data/jobs";
import {Bookmark} from "lucide-react";

const SALARY_OPTIONS = [
  { label: "Any salary", min: 0, max: 999999 },
  { label: "Under $50k", min: 0, max: 50000 },
  { label: "$50k – $100k", min: 50000, max: 100000 },
  { label: "$100k – $150k", min: 100000, max: 150000 },
  { label: "Over $150k", min: 150000, max: 999999 },
];

const AGE_OPTIONS = [
  { label: "Any age", min: 0, max: 99 },
  { label: "18 – 25", min: 18, max: 25 },
  { label: "25 – 35", min: 25, max: 35 },
  { label: "35 – 45", min: 35, max: 45 },
  { label: "45+", min: 45, max: 99 },
];

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-[var(--color-secondary-100)] pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-secondary-400)] mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function SelectFilter({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-[var(--color-secondary-200)] rounded-md text-sm text-[var(--color-secondary-700)] px-3 py-2 outline-none focus:border-[var(--color-main-500)] transition-colors cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={typeof opt === "string" ? opt : opt.label} value={typeof opt === "string" ? opt : opt.label}>
          {typeof opt === "string" ? opt : opt.label}
        </option>
      ))}
    </select>
  );
}

export default function JobFilters({ filters, updateFilter, resetFilters, activeFilterCount }) {
  const selectedSalary = SALARY_OPTIONS.find(
    (o) => o.min === filters.salaryMin && o.max === filters.salaryMax
  );

  const selectedAge = AGE_OPTIONS.find(
    (o) => o.min === filters.ageMin && o.max === filters.ageMax
  );

  const handleSalaryChange = (label) => {
    if (!label) {
      updateFilter("salaryMin", 0);
      updateFilter("salaryMax", 999999);
      return;
    }
    const opt = SALARY_OPTIONS.find((o) => o.label === label);
    if (opt) {
      updateFilter("salaryMin", opt.min);
      updateFilter("salaryMax", opt.max);
    }
  };

  const handleAgeChange = (label) => {
    if (!label) {
      updateFilter("ageMin", 0);
      updateFilter("ageMax", 99);
      return;
    }
    const opt = AGE_OPTIONS.find((o) => o.label === label);
    if (opt) {
      updateFilter("ageMin", opt.min);
      updateFilter("ageMax", opt.max);
    }
  };

  return (
    <aside className="bg-white border border-[var(--color-secondary-100)] p-5 rounded-md">


      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-[Poppins] font-semibold text-sm text-[var(--color-secondary-800)]">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-[var(--color-main-500)] text-white text-[10px] font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-[var(--color-secondary-400)] hover:text-[var(--color-main-500)] transition-colors"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Destination Country">
        <SelectFilter
          value={filters.country}
          onChange={(v) => updateFilter("country", v )}
          options={COUNTRIES}
          placeholder="All countries"
        />
      </FilterSection>

      <FilterSection title="Job Category">
        <SelectFilter
          value={filters.category}
          onChange={(v) => updateFilter("category", v)}
          options={CATEGORIES}
          placeholder="All categories"
        />
      </FilterSection>

      <FilterSection title="Salary Range">
        <SelectFilter
          value={selectedSalary?.label || ""}
          onChange={handleSalaryChange}
          options={SALARY_OPTIONS.slice(1)}
          placeholder="Any salary"
        />
      </FilterSection>

      <FilterSection title="Gender Preference">
        <SelectFilter
          value={filters.genderPreference}
          onChange={(v) => updateFilter("genderPreference", v)}
          options={GENDER_OPTIONS}
          placeholder="No preference"
        />
      </FilterSection>

      <FilterSection title="Age Range">
        <SelectFilter
          value={selectedAge?.label || ""}
          onChange={handleAgeChange}
          options={AGE_OPTIONS.slice(1)}
          placeholder="Any age"
        />
      </FilterSection>
    </aside>
  );
}