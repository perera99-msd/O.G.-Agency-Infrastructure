// src/app/lock-page/LockPageClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { AppLockScreen } from "@/components/auth/AppLockScreen";

export function LockPageClient() {
  const router = useRouter();

  const handleUnlock = () => {
    router.push("/dashboard");
  };

  return <AppLockScreen onUnlock={handleUnlock} />;
}