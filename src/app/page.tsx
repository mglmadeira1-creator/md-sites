"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import Footer from "@/components/layout/Footer";
import IntroLoader from "@/components/IntroLoader";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const visited = sessionStorage.getItem("md-sites-visited");
    if (visited) {
      setShowLoader(false);
    }
  }, []);

  if (!mounted) {
    // Render a blank black viewport to bypass initial hydration mismatches and prevent flashing
    return <div className="min-h-screen bg-[#030712]" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <IntroLoader
            onComplete={() => {
              setShowLoader(false);
              sessionStorage.setItem("md-sites-visited", "true");
            }}
          />
        )}
      </AnimatePresence>

      {!showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen flex flex-col"
        >
          <Navbar />
          <main className="flex-1 bg-brand-blue-dark">
            <Hero />
            <HowItWorks />
            <Features />
            <Pricing />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
