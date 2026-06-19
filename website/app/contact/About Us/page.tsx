import AboutHero from "@/components/About Us/AboutHero";
import MissionVision from "@/components/About Us/MissionVision";
import AboutServices from "@/components/About Us/AboutServices";
import WhyChooseSriLankan from "@/components/About Us/WhyChooseSriLankan";
import ChairmanMessage from "@/components/About Us/ChairmanMessage";
import Credentials from "@/components/About Us/Credentials";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <AboutHero />
      <MissionVision />
      <AboutServices />
      <WhyChooseSriLankan />
      <ChairmanMessage />
      <Credentials />
    </div>
  );
}
