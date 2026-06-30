import Hero from "@/components/home/Hero";
import VideoShowcase from "@/components/home/VideoShowcase";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import AboutIntro from "@/components/home/AboutIntro";
import Stats from "@/components/home/Stats";
import GalleryMarquee from "@/components/home/GalleryMarquee";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <VideoShowcase />
      <FeaturedDestinations />
      <AboutIntro />
      <Stats />
      <GalleryMarquee />
      <Testimonials />
    </div>
  );
}