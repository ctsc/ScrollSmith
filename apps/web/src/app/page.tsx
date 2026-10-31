import { Navbar } from "@/components/Navbar";
import { Install } from "@/components/Install";
import { Marquee } from "@/components/Marquee";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-grid" />
        <Install />
        <Marquee />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
