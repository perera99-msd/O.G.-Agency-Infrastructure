import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="portal-layout">
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
