import HeroScroll from "@/components/HeroScroll";
import Drone3DSection from "@/components/Drone3DSection";
import SiteFooterSections from "@/components/SiteFooterSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0e14]">
      <HeroScroll />
      <Drone3DSection />
      <SiteFooterSections />
    </main>
  );
}
