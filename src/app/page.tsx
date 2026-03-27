import HeroScroll from "@/components/HeroScroll";
import Drone3DSection from "@/components/Drone3DSection";
import GlobalNav from "@/components/GlobalNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0e14]">
      <GlobalNav />
      <HeroScroll />
      <Drone3DSection />
    </main>
  );
}
