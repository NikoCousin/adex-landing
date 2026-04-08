import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MoneyFlow from "@/components/MoneyFlow";
import PartnerStrip from "@/components/PartnerStrip";
import PrimeOTC from "@/components/PrimeOTC";
import Brokerage from "@/components/Brokerage";
import Advisory from "@/components/Advisory";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SectionDivider />
      <MoneyFlow />
      <SectionDivider />
      <PartnerStrip />
      <SectionDivider />
      <PrimeOTC />
      <SectionDivider />
      <Brokerage />
      <SectionDivider />
      <Advisory />
    </main>
  );
}
