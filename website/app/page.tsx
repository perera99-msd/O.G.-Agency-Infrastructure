import Hero from "@/components/home/Hero";
import CountryDestinations from "@/components/home/CountryDestinations";
import AboutIntro from "@/components/home/AboutIntro";
import LifeAbroad from "@/components/home/LifeAbroad";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <CountryDestinations />
      <AboutIntro />
      <LifeAbroad />
      <Stats />
      <Testimonials />
    </div>
  );
}