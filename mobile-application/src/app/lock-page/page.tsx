// src/app/lock-page/page.tsx
import type { Metadata } from "next";
import { LockPageClient } from "./LockPageClient";

export const metadata: Metadata = {
  title: "App Locked | OG Agency",
};

export default function LockPage() {
  return <LockPageClient />;
}