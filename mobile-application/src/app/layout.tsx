import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "OG Agency Mobile App",
  description: "OG Agency application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
