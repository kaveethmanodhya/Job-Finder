import HeroSection from "@/components/HeroSection";
import ScrollSequenceSectionClient from "@/components/ScrollSequenceSectionClient";

export default function HomePage() {
  return (
    <main className="relative bg-[#08050f] text-white overflow-x-hidden">
      <ScrollSequenceSectionClient />
      {/* Below-the-fold sections can be added here */}
    </main>
  );
}
