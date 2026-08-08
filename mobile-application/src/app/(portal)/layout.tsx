import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLockProvider } from "@/components/auth/AppLockProvider";
import { MobileShell } from "@/components/layout/MobileShell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppLockProvider>
        <MobileShell>
          {children}
        </MobileShell>
      </AppLockProvider>
    </AuthGuard>
  );
}
