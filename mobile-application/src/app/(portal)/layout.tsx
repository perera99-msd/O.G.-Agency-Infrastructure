import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLockProvider } from "@/components/auth/AppLockProvider";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppLockProvider>
        <div className="portal-layout">
          <main>{children}</main>
        </div>
      </AppLockProvider>
    </AuthGuard>
  );
}
