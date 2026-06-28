// lib/hooks/useBookmarks.js
"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "og_saved_jobs";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {
      setBookmarks([]);
    }
  }, []);

  const persist = (ids) => {
    setBookmarks(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  };

  const toggleBookmark = useCallback(
    (jobId) => {
      const next = bookmarks.includes(jobId)
        ? bookmarks.filter((id) => id !== jobId)
        : [...bookmarks, jobId];
      persist(next);
    },
    [bookmarks]
  );

  const isBookmarked = useCallback(
    (jobId) => bookmarks.includes(jobId),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}