import type { Metadata } from "next";
import GalleryContent from "@/components/gallery/GalleryContent";

export const metadata: Metadata = {
  title: "Garment Factory Placements Gallery | O.G. Agency",
  description: "Browse photos of our successfully placed industrial sewing machine operators, quality inspectors, cutting divisions, and technical training hubs at O.G. Agency.",
};

export default function GalleryPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <GalleryContent />
    </div>
  );
}
