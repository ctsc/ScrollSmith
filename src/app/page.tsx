import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Simplicity } from "@/components/Simplicity";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <HowItWorks />
        <Features />
        <Simplicity />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
