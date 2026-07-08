// src/app/(auth)/forgot-password/page.tsx
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | OG Agency Applicant Portal",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
