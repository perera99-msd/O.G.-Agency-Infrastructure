// src/components/portal/StatusBadge.tsx
"use client";

import type { DocumentStatus } from "@/types/applicant";

interface StatusBadgeProps {
  status: DocumentStatus | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: string }> = {
  pending: { label: "Pending", className: "status-pending", icon: "⏳" },
  uploaded: { label: "Uploaded", className: "status-uploaded", icon: "✓" },
  verified: { label: "Verified", className: "status-verified", icon: "✔" },
  rejected: { label: "Rejected", className: "status-rejected", icon: "✕" },
  expired: { label: "Expired", className: "status-expired", icon: "⚠" },
};

export function StatusBadge({ status, size = "md", showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: "status-default",
    icon: "•",
  };

  const sizeClass = {
    sm: "status-badge--sm",
    md: "status-badge--md",
    lg: "status-badge--lg",
  }[size];

  return (
    <span className={`status-badge ${config.className} ${sizeClass}`}>
      {showIcon && <span className="status-badge__icon">{config.icon}</span>}
      <span className="status-badge__label">{config.label}</span>
    </span>
  );
}
