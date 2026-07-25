"use client";

import React from "react";
import { Sparkles, MessageSquare, ArrowRight, Star } from "lucide-react";
import { designTokens } from "../tokens";
import { ThemeConfig } from "../themes";

interface SectionProps {
  theme: ThemeConfig;
  borderRadius: string;
  fontFamily: string;
  shadow: string;
  spacing: string;
  content: {
    brandName: string;
    category: string;
    description: string;
    services: { name: string; desc: string }[];
  };
  features: string[];
}

// 1. NAVIGATION COMPONENT LIBRARY
export function NavbarSection({ theme, borderRadius, fontFamily, content, features }: SectionProps) {
  const isLight = theme.isLight;
  return (
    <div 
      className={`flex items-center justify-between p-6 border-b transition-all duration-300 ${fontFamily}`}
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border
      }}
    >
      <div 
        className="font-bold text-lg flex items-center gap-1.5 select-none"
        style={{ color: theme.textPrimary }}
      >
        <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
        {content.brandName}
      </div>
      <div 
        className="hidden sm:flex items-center gap-6 text-xs font-semibold select-none"
        style={{ color: theme.textSecondary }}
      >
        <span className="hover:opacity-85 cursor-pointer">Início</span>
        {features.includes("servicos") && <span className="hover:opacity-85 cursor-pointer">Serviços</span>}
        {features.includes("galeria") && <span className="hover:opacity-85 cursor-pointer">Galeria</span>}
        {features.includes("depoimentos") && <span className="hover:opacity-85 cursor-pointer">Clientes</span>}
      </div>
    </div>
  );
}

// 2. HERO COMPONENT LIBRARY
export function HeroSection({ theme, borderRadius, fontFamily, shadow, spacing, content }: SectionProps) {
  const spacingToken = spacing === "compact" ? designTokens.spacing.compact : spacing === "wide" ? designTokens.spacing.wide : designTokens.spacing.normal;
  const borderToken = borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-md" : borderRadius === "full" ? "rounded-full" : "rounded-2xl";

  return (
    <div className={`text-center space-y-6 max-w-3xl mx-auto ${spacingToken.padding} ${fontFamily}`}>
      <div 
        className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full text-[10px] font-bold border"
        style={{ 
          borderColor: theme.border, 
          backgroundColor: theme.surface,
          color: theme.primary 
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {content.category}
      </div>
      <h1 
        className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight uppercase"
        style={{ color: theme.textPrimary }}
      >
        Soluções premium para {content.brandName}
      </h1>
      <p 
        className="text-xs leading-relaxed max-w-md mx-auto"
        style={{ color: theme.textSecondary }}
      >
        {content.description}
      </p>
      <div className="flex items-center justify-center gap-3.5 pt-2">
        <button 
          className={`px-5 py-3 text-xs font-bold transition-all hover:opacity-90 ${borderToken}`}
          style={{ backgroundColor: theme.primary, color: theme.isLight ? "#ffffff" : "#000000" }}
        >
          Explorar Serviços
        </button>
        <button 
          className={`px-5 py-3 text-xs font-bold border transition-all hover:bg-white/5 ${borderToken}`}
          style={{ borderColor: theme.border, color: theme.textPrimary }}
        >
          Falar Connosco
        </button>
      </div>
    </div>
  );
}

// 3. SERVICES COMPONENT LIBRARY
export function ServicesSection({ theme, borderRadius, fontFamily, shadow, spacing, content }: SectionProps) {
  const spacingToken = spacing === "compact" ? designTokens.spacing.compact : spacing === "wide" ? designTokens.spacing.wide : designTokens.spacing.normal;
  const borderToken = borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-md" : borderRadius === "full" ? "rounded-full" : "rounded-2xl";
  const shadowToken = shadow === "none" ? "shadow-none border-white/5" : shadow === "sm" ? "shadow-sm" : shadow === "lg" ? "shadow-2xl" : `shadow-[0_0_20px_${theme.primary}20]`;

  return (
    <div className={`border-t max-w-4xl mx-auto ${spacingToken.padding} ${fontFamily}`} style={{ borderColor: theme.border }}>
      <div className="text-center space-y-1.5 mb-8">
        <h3 className="text-xl font-bold" style={{ color: theme.textPrimary }}>Nossos Serviços</h3>
        <p className="text-[10px] uppercase tracking-wider text-slate-500">Soluções sob medida para o seu negócio</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.services.map((srv, idx) => (
          <div 
            key={idx} 
            className={`p-5 flex flex-col justify-between h-[155px] border transition-all duration-300 ${borderToken} ${shadowToken}`}
            style={{ 
              backgroundColor: theme.surface, 
              borderColor: theme.border 
            }}
          >
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold" style={{ color: theme.textPrimary }}>{srv.name}</h4>
              <p className="text-[10px] leading-relaxed" style={{ color: theme.textSecondary }}>{srv.desc}</p>
            </div>
            <span className="text-[10px] font-bold flex items-center gap-1 hover:opacity-80 cursor-pointer" style={{ color: theme.primary }}>
              ➔ Saber mais
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. GALLERY COMPONENT LIBRARY
export function GallerySection({ theme, borderRadius, fontFamily, shadow, spacing }: SectionProps) {
  const spacingToken = spacing === "compact" ? designTokens.spacing.compact : spacing === "wide" ? designTokens.spacing.wide : designTokens.spacing.normal;
  const borderToken = borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-md" : borderRadius === "full" ? "rounded-full" : "rounded-2xl";
  const shadowToken = shadow === "none" ? "shadow-none border-white/5" : shadow === "sm" ? "shadow-sm" : shadow === "lg" ? "shadow-2xl" : `shadow-[0_0_20px_${theme.primary}20]`;

  return (
    <div className={`border-t max-w-4xl mx-auto ${spacingToken.padding} ${fontFamily}`} style={{ borderColor: theme.border }}>
      <div className="text-center space-y-1.5 mb-8">
        <h3 className="text-xl font-bold" style={{ color: theme.textPrimary }}>Galeria & Portfólio</h3>
        <p className="text-[10px] uppercase tracking-wider text-slate-500">Nosso trabalho recente</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`aspect-video flex items-center justify-center text-[10px] border transition-all duration-300 ${borderToken} ${shadowToken}`}
            style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.textSecondary }}
          >
            Trabalho Recente {i}
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. TESTIMONIALS COMPONENT LIBRARY
export function TestimonialsSection({ theme, borderRadius, fontFamily, shadow, spacing }: SectionProps) {
  const spacingToken = spacing === "compact" ? designTokens.spacing.compact : spacing === "wide" ? designTokens.spacing.wide : designTokens.spacing.normal;
  const borderToken = borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-md" : borderRadius === "full" ? "rounded-full" : "rounded-2xl";
  const shadowToken = shadow === "none" ? "shadow-none border-white/5" : shadow === "sm" ? "shadow-sm" : shadow === "lg" ? "shadow-2xl" : `shadow-[0_0_20px_${theme.primary}20]`;

  return (
    <div className={`border-t max-w-3xl mx-auto ${spacingToken.padding} ${fontFamily}`} style={{ borderColor: theme.border }}>
      <div className="text-center space-y-1.5 mb-8">
        <h3 className="text-xl font-bold" style={{ color: theme.textPrimary }}>Testemunhos</h3>
        <p className="text-[10px] uppercase tracking-wider text-slate-500">O que os clientes dizem de nós</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Joana Ferreira", text: "Excelente dedicação e design incrível. Altamente recomendado!" },
          { name: "Carlos Pereira", text: "Profissionalismo total. O site ultrapassou as nossas expectativas." }
        ].map((dep, idx) => (
          <div 
            key={idx} 
            className={`p-5 border space-y-3.5 ${borderToken} ${shadowToken}`}
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <div className="flex text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500" />)}
            </div>
            <p className="text-[10px] italic leading-relaxed" style={{ color: theme.textSecondary }}>"{dep.text}"</p>
            <span className="text-[10px] font-bold block" style={{ color: theme.textPrimary }}>{dep.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. FAQ COMPONENT LIBRARY
export function FAQSection({ theme, borderRadius, fontFamily, shadow, spacing }: SectionProps) {
  const spacingToken = spacing === "compact" ? designTokens.spacing.compact : spacing === "wide" ? designTokens.spacing.wide : designTokens.spacing.normal;
  const borderToken = borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-md" : borderRadius === "full" ? "rounded-full" : "rounded-2xl";
  const shadowToken = shadow === "none" ? "shadow-none border-white/5" : shadow === "sm" ? "shadow-sm" : shadow === "lg" ? "shadow-2xl" : `shadow-[0_0_20px_${theme.primary}20]`;

  return (
    <div className={`border-t max-w-3xl mx-auto ${spacingToken.padding} ${fontFamily}`} style={{ borderColor: theme.border }}>
      <h2 className="text-xl font-bold text-center mb-6" style={{ color: theme.textPrimary }}>Perguntas Frequentes</h2>
      <div className="space-y-3.5">
        {[
          { q: "Quais são os vossos prazos de entrega?", a: "Dependendo da complexidade do projeto, tipicamente realizamos a entrega final num prazo de 3 a 7 dias úteis." },
          { q: "Posso solicitar alterações após a publicação?", a: "Sim, suportamos facilidade de alteração e modificações continuas a qualquer momento." }
        ].map((faq, fi) => (
          <div 
            key={fi} 
            className={`p-4.5 border ${borderToken} ${shadowToken}`}
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <h4 className="text-xs font-bold mb-1.5" style={{ color: theme.textPrimary }}>{faq.q}</h4>
            <p className="text-[10px] leading-relaxed" style={{ color: theme.textSecondary }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. FOOTER COMPONENT LIBRARY
export function FooterSection({ theme, fontFamily, content }: SectionProps) {
  return (
    <div 
      className={`p-8 border-t text-center text-[10px] select-none ${fontFamily}`} 
      style={{ borderColor: theme.border, color: theme.textSecondary }}
      suppressHydrationWarning
    >
      &copy; {new Date().getFullYear()} {content.brandName}. Desenvolvido com a MD Sites Design Library.
    </div>
  );
}
