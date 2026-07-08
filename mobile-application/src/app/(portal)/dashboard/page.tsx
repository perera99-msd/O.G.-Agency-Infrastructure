import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. What would you like to do today?</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Link href="/documents" style={{ textDecoration: "none" }}>
          <Button variant="primary">My Documents</Button>
        </Link>
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <Button variant="outline">My Profile</Button>
        </Link>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/register" style={{ textDecoration: "none" }}>
          <Button variant="outline">Register</Button>
        </Link>
        <Link href="/forgot-password" style={{ textDecoration: "none" }}>
          <Button variant="outline">Forgot Password</Button>
        </Link>
      </div>
    </div>
  );
}
