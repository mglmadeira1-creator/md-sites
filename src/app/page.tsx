import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-blue-dark">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
