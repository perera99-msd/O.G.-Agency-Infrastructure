// src/app/(auth)/pin-setup/page.tsx
import type { Metadata } from "next";
import { PinSetupPageClient } from "./PinSetupPageClient";

export const metadata: Metadata = {
  title: "Set App PIN | OG Agency",
};

export default function Page() {
  return <PinSetupPageClient />;
}