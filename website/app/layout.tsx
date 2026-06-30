import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIChatBot from "@/components/chat/AIChatBot";

// Load Inter for standard body text
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Load Poppins for Headings
const poppins = Poppins({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

// Load Roboto Mono for Code/Numbers
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

// Load Cinzel for Logo text matching classical serif style
const cinzel = Cinzel({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "O.G. Agency | Digital Recruitment",
  description: "Modernizing global employment and visa processing.",
  icons: {
    icon: [
      { url: "/Logo/logo.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} ${cinzel.variable} font-sans`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <AIChatBot />
        <Footer />
      </body>
    </html>
  );
}