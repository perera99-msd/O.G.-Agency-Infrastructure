import Hero from "@/components/home/Hero";
import VideoShowcase from "@/components/home/VideoShowcase";
import AboutIntro from "@/components/home/AboutIntro";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <VideoShowcase />
      <AboutIntro />
      <Stats />
      <Testimonials />
    </div>
  );
}