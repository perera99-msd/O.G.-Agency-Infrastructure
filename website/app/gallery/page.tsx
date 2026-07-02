import type { Metadata } from "next";
import GalleryContent from "@/components/gallery/GalleryContent";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const metadata: Metadata = {
  title: "Garment Factory Placements Gallery | O.G. Agency",
  description: "Browse photos of our successfully placed industrial sewing machine operators, quality inspectors, cutting divisions, and technical training hubs at O.G. Agency.",
};

export const revalidate = 0; // Disable static caching so it fetches real-time data

export default async function GalleryPage() {
  let initialItems: any[] = [];
  try {
    const q = query(collection(db, "gallery"));
    const snapshot = await getDocs(q);
    initialItems = snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    // Sort items by dateAdded descending (newest first)
    initialItems.sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime());
  } catch (error) {
    console.error("Error reading gallery data from Firestore:", error);
  }

  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <GalleryContent items={initialItems} />
    </div>
  );
}
