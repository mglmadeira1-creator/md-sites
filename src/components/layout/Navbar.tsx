"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Como Funciona", href: "#como-funciona" },
    { name: "Funcionalidades", href: "#funcionalidades" },
    { name: "Preços", href: "#precos" },
    { name: "Simular Website", href: "/simular", highlight: true },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-morphism py-3 shadow-lg border-b border-brand-gold/10"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logonovo.png"
                  alt="MD Sites Logo"
                  width={1232}
                  height={352}
                  className="h-56 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-brand-gold ${
                    link.highlight
                      ? "text-brand-gold font-semibold flex items-center gap-1 bg-brand-gold/10 px-3 py-1.5 rounded-full border border-brand-gold/25 shadow-sm"
                      : "text-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:flex items-center">
              <Link
                href="/simular"
                className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-brand-gold via-amber-300 to-brand-gold-dark rounded-xl" />
                <span className="absolute inset-0 bg-gradient-to-r from-brand-gold via-amber-300 to-brand-gold-dark rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-[#030712] rounded-[11px] group-hover:bg-opacity-0">
                  <span className="relative flex items-center gap-2 text-sm font-semibold text-white group-hover:text-brand-blue-dark">
                    Começar Grátis
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-brand-gold p-2 rounded-lg focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden glass-morphism border-b border-brand-gold/10 px-4 pt-2 pb-6 space-y-3"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                    link.highlight
                      ? "text-brand-gold bg-brand-gold/10 border border-brand-gold/20"
                      : "text-slate-300 hover:text-brand-gold hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/simular"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-bold hover:shadow-lg hover:shadow-brand-gold/20 transition-all duration-300"
                >
                  Começar Grátis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
