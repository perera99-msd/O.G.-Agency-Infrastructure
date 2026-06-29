// lib/hooks/useJobFilters.js
// Hybrid approach: client-side filtering on mock data now.
// To switch to server-side: replace the `useMemo` block with a `useEffect`
// that calls your API with `filters` as query params, and set results via setState.

"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { jobs } from "@/utils/data/jobs";

export const JOBS_PER_PAGE = 24;

const defaultFilters = {
  search: "",
  country: "",
  category: "",
  salaryMin: 0,
  salaryMax: 999999,
  genderPreference: "",
  ageMin: 0,
  ageMax: 99,
  page: 1,
  sortBy: "urgent_first", // always default
  savedOnly: false,
};

export function useJobFilters() {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const country = params.get("country");
      const category = params.get("category");
      const search = params.get("search");

      if (country || category || search) {
        setFilters((prev) => ({
          ...prev,
          country: country || prev.country,
          category: category || prev.category,
          search: search || prev.search,
        }));
      }
    }
  }, []);

  // --- FILTER UPDATERS ---
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const setPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // --- FILTERING LOGIC ---
  // To go server-side: delete this useMemo, add useEffect with fetch() instead.
  const { results, totalCount, totalPages } = useMemo(() => {
    let filtered = [...jobs];

    // 1. Urgent always on top
    filtered.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return new Date(b.postedAt) - new Date(a.postedAt);
    });

    // 2. Search — title + tags
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.tags.some((t) => t.toLowerCase().includes(q)) ||
          job.category.toLowerCase().includes(q)
      );
    }

    // 3. Country
    if (filters.country) {
      filtered = filtered.filter((job) => job.country === filters.country);
    }

    // 4. Category
    if (filters.category) {
      filtered = filtered.filter((job) => job.category === filters.category);
    }

    // 5. Salary range
    if (filters.salaryMin > 0 || filters.salaryMax < 999999) {
      filtered = filtered.filter(
        (job) =>
          job.salary.min >= filters.salaryMin &&
          job.salary.max <= filters.salaryMax
      );
    }

    if (filters.savedOnly) {
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem("og_saved_jobs") || "[]");
  } catch {}
  filtered = filtered.filter((job) => saved.includes(job.id));
}

    // 6. Gender preference
    if (filters.genderPreference) {
      filtered = filtered.filter(
        (job) =>
          job.genderPreference === filters.genderPreference ||
          job.genderPreference === "No Preference"
      );
    }

    // 7. Age range
    if (filters.ageMin > 0 || filters.ageMax < 99) {
      filtered = filtered.filter(
        (job) =>
          job.ageRange.min >= filters.ageMin &&
          job.ageRange.max <= filters.ageMax
      );
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

    // 8. Pagination
    const start = (filters.page - 1) * JOBS_PER_PAGE;
    const results = filtered.slice(start, start + JOBS_PER_PAGE);

    return { results, totalCount, totalPages };
  }, [filters]);

  const activeFilterCount = Object.entries(filters).filter(([key, val]) => {
    if (["page", "sortBy", "savedOnly" ].includes(key)) return false;
    if (key === "salaryMin") return val > 0;
    if (key === "salaryMax") return val < 999999;
    if (key === "ageMin") return val > 0;
    if (key === "ageMax") return val < 99;
    return val !== "";
  }).length;

  return {
    filters,
    results,
    totalCount,
    totalPages,
    activeFilterCount,
    updateFilter,
    resetFilters,
    setPage,
  };
}