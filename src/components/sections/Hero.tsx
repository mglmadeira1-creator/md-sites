"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [terminalStep, setTerminalStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const logs = [
    "❯ md-sites deploy --ai",
    "✓ Analisando descrição do negócio...",
    "✓ Definindo paleta de cores (Azul & Ouro)...",
    "✓ Criando estrutura de navegação...",
    "✓ Redigindo textos persuasivos com IA...",
    "✓ Otimizando imagens e layout responsivo...",
    "✓ Configurando SEO automático...",
    "✓ Gerando sitemap.xml e robots.txt..."
  ];

  useEffect(() => {
    if (terminalStep < logs.length) {
      const timer = setTimeout(() => {
        setTerminalLogs((prev) => [...prev, logs[terminalStep]]);
        setTerminalStep((prev) => prev + 1);
      }, terminalStep === 0 ? 800 : 1000);
      return () => clearTimeout(timer);
    } else {
      // Hold complete state, then loop after 6s
      const resetTimer = setTimeout(() => {
        setTerminalLogs([]);
        setTerminalStep(0);
      }, 6000);
      return () => clearTimeout(resetTimer);
    }
  }, [terminalStep]);

  return (
    <section 
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: "url('/fundo-paginas.png')" }}
    >
      {/* Subtle backdrop overlay for overall contrast */}
      <div className="absolute inset-0 bg-black/15 -z-10" />

      <div className="max-w-[92rem] mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Title & Intro */}
          <div className="lg:col-span-7 space-y-8 text-left relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d1527]/60 backdrop-blur-md border border-[#D4AF37]/35 shadow-lg"
            >
              <Sparkles className="w-4.5 h-4.5 text-brand-gold fill-brand-gold/20 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-brand-gold uppercase tracking-wider">
                Criação Automática com IA
              </span>
            </motion.div>

            {/* Heading (Increased by ~30% in overall presence) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-display font-extrabold text-white leading-[1.04] tracking-tight"
            >
              Cria um website <br className="hidden sm:inline" />
              profissional com IA em <br className="hidden sm:inline" />
              <span className="text-gradient-gold">poucos minutos.</span>
            </motion.h1>

            {/* Subheading (Increased scale and width) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-slate-350 max-w-3xl leading-relaxed font-sans"
            >
              Descreve o teu negócio e a nossa Inteligência Artificial cria automaticamente um website moderno, profissional e pronto para publicar.
            </motion.p>

            {/* Action Buttons (Increased by ~30% in scale) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center pt-2"
            >
              {/* Primary Premium Gold Button */}
              <Link
                href="/simular"
                className="relative flex items-center justify-center px-12 py-5.5 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C5A059] text-brand-blue-dark font-extrabold text-base sm:text-xl tracking-wide shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_55px_rgba(212,175,55,0.75)] hover:scale-[1.03] transition-all duration-300 group"
              >
                Criar Website Gratuitamente
                <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1.5 stroke-[3]" />
              </Link>

              {/* Secondary Play Button */}
              <Link
                href="#como-funciona"
                className="flex items-center justify-center gap-2 px-10 py-5.5 rounded-xl border border-slate-700/60 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/60 hover:border-slate-650 hover:scale-[1.02] text-white font-bold text-base sm:text-xl transition-all duration-300"
              >
                <Play className="w-4.5 h-4.5 text-brand-gold fill-brand-gold" />
                Ver Demonstração
              </Link>
            </motion.div>
          </div>

          {/* Right Column: AI Interactive Terminal Simulation */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            
            {/* Halo de luz ambiente / Background glow wrapper */}
            <div className="absolute -bottom-14 -left-14 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -top-14 -right-14 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Neon Border Glow wrapper container */}
            <motion.div
              layoutId="hero-terminal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full rounded-2xl p-[2px] relative"
              style={{
                background: "linear-gradient(225deg, #D4AF37 0%, #D4AF37 40%, #3b82f6 60%, #3b82f6 100%)",
                boxShadow: `
                  -20px 20px 70px -8px rgba(59, 130, 246, 0.7), 
                  20px -20px 70px -8px rgba(212, 175, 55, 0.6)
                `
              }}
            >
              {/* Actual Terminal Window */}
              <div className="w-full rounded-[15px] overflow-hidden backdrop-blur-lg bg-slate-950/85 flex flex-col justify-start relative">
                
                {/* Light reflection gloss effect */}
                <div className="absolute top-0 left-0 right-0 h-[140px] bg-gradient-to-b from-white/6 to-white/0 pointer-events-none z-20" />

                {/* Terminal Header */}
                <div className="flex items-center justify-between px-6 py-5 bg-slate-950 border-b border-slate-900/90 relative z-10 select-none">
                  {/* MacOS buttons */}
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
                  </div>
                  {/* File title */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base text-slate-400 font-mono">
                    <Code className="w-4.5 h-4.5 text-slate-500" />
                    md-sites-compiler.ts
                  </div>
                  {/* Dummy end alignment item */}
                  <div className="w-12" />
                </div>

                {/* Terminal screen area (Scaled up 30%) */}
                <div className="p-8 font-mono text-sm sm:text-base md:text-lg min-h-[440px] flex flex-col justify-start space-y-4.5 relative z-10 select-none">
                  <AnimatePresence>
                    {terminalLogs.map((log, index) => {
                      const isCommand = log.startsWith("❯");
                      const isSuccess = log.startsWith("✓");

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`${
                            isCommand
                              ? "text-slate-100 font-bold"
                              : isSuccess
                              ? "text-[#10b981]"
                              : "text-[#10b981]"
                          }`}
                        >
                          {log}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {/* Cursor */}
                  <div className="flex items-center">
                    <span className="w-3.5 h-6 bg-[#10b981] animate-pulse" />
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
