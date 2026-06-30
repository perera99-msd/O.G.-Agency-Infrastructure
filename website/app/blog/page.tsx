import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Global Relocation & Labor Insights Blog | O.G. Agency",
  description: "Stay up to date with European Union work permit directives, garment factory labor regulations, and overseas candidate success guides from O.G. Agency.",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <BlogHero />
      <BlogGrid />
    </div>
  );
}
