import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PartnerTicker from "@/components/PartnerTicker";
import MoneyFlow from "@/components/MoneyFlow";
import PrimeOTC from "@/components/PrimeOTC";
import Brokerage from "@/components/Brokerage";
import Advisory from "@/components/Advisory";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PartnerTicker />
      <MoneyFlow />
      <PrimeOTC />
      <Brokerage />
      <Advisory />
      <Footer />
    </main>
  );
}
