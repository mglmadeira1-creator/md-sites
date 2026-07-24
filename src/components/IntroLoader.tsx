"use client";

import { useEffect, useState } from "react";
import { Code, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const [launching, setLaunching] = useState(false);
  
  const fullCommand = "❯ md-sites deploy --ai";

  // Typewriter effect (Faster - 400ms total)
  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < fullCommand.length) {
        setTypedCommand(prev => prev + fullCommand[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setStep(1); // Start sequence
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Non-linear progression steps mimicking a real AI compile
  useEffect(() => {
    if (step === 0) return;

    if (step === 1) {
      // 0% to 18%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 18) return prev + 2;
          clearInterval(interval);
          setTimeout(() => setStep(2), 300);
          return prev;
        });
      }, 15);
    } 
    else if (step === 2) {
      // 18% to 42%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 42) return prev + 3;
          clearInterval(interval);
          setTimeout(() => setStep(3), 350);
          return prev;
        });
      }, 15);
    }
    else if (step === 3) {
      // 42% to 73%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 73) return prev + 4;
          clearInterval(interval);
          setTimeout(() => setStep(4), 350);
          return prev;
        });
      }, 15);
    }
    else if (step === 4) {
      // 73% to 91%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 91) return prev + 3;
          clearInterval(interval);
          setTimeout(() => setStep(5), 300);
          return prev;
        });
      }, 15);
    }
    else if (step === 5) {
      // 91% to 100%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) return prev + 3;
          clearInterval(interval);
          setTimeout(() => setStep(6), 300);
          return prev;
        });
      }, 15);
    }
    else if (step === 6) {
      // Show "Website Ready." wait 300ms, then show Launching...
      const timer = setTimeout(() => {
        setLaunching(true);
        // Cinematic morph trigger
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const getProgressBlocks = (pct: number) => {
    const totalBlocks = 20;
    const filledBlocks = Math.round((pct / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712] overflow-hidden"
    >
      {/* Background Image Base */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 -z-10" 
        style={{ backgroundImage: "url('/fundo-paginas.png')" }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/95 via-[#030712]/90 to-[#030712] -z-10" />

      {/* Center glowing halo */}
      <div className="absolute w-[450px] h-[450px] bg-brand-blue/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Shared Layout Terminal Container */}
      <motion.div
        layoutId="hero-terminal"
        className="w-full max-w-xl mx-4 rounded-2xl p-[2px] relative"
        style={{
          background: "linear-gradient(225deg, #D4AF37 0%, #D4AF37 40%, #3b82f6 60%, #3b82f6 100%)",
          boxShadow: `
            -15px 15px 50px -10px rgba(59, 130, 246, 0.45), 
            15px -15px 50px -10px rgba(212, 175, 55, 0.35)
          `
        }}
      >
        <div className="w-full rounded-[15px] overflow-hidden backdrop-blur-lg bg-slate-950/90 flex flex-col justify-start">
          
          {/* Glass reflection gloss overlay */}
          <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none z-20" />

          {/* Terminal Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-900/90 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Code className="w-4.5 h-4.5 text-slate-500" />
              md-sites-engine
            </div>
            <div className="w-12" />
          </div>

          {/* Terminal Screen area */}
          <div className="p-6 font-mono text-xs sm:text-sm text-[#10b981] space-y-2.5 min-h-[340px] flex flex-col justify-start relative">
            
            {/* Typed command line */}
            <div className="text-slate-100 font-bold flex items-center">
              <span>{typedCommand}</span>
              {step === 0 && (
                <span className="inline-block w-2 h-4 ml-1 bg-slate-100 animate-pulse" />
              )}
            </div>

            {/* Non-linear progress bar */}
            {step > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-1"
              >
                <div className="text-slate-350">
                  {getProgressBlocks(progress)} {progress}%
                </div>
              </motion.div>
            )}

            {/* Checklist elements mapping user requested list */}
            <div className="space-y-1.5 pt-1 text-slate-300">
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Analisando descrição do negócio...</span>
                </motion.div>
              )}
              {step >= 2 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Criando identidade visual...</span>
                </motion.div>
              )}
              {step >= 2 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Definindo paleta de cores...</span>
                </motion.div>
              )}
              {step >= 3 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Criando estrutura de navegação...</span>
                </motion.div>
              )}
              {step >= 3 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Redigindo textos persuasivos com IA...</span>
                </motion.div>
              )}
              {step >= 4 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Otimizando imagens e layout responsivo...</span>
                </motion.div>
              )}
              {step >= 4 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Configurando SEO automático...</span>
                </motion.div>
              )}
              {step >= 5 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Gerando sitemap.xml e robots.txt...</span>
                </motion.div>
              )}
              {step >= 5 && (
                <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Publicando website...</span>
                </motion.div>
              )}
            </div>

            {/* Finished build log */}
            {step >= 6 && (
              <motion.div 
                initial={{ opacity: 0, y: 3 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="pt-2 text-emerald-400 font-bold flex items-center gap-2"
              >
                <span>✓ Website Ready.</span>
              </motion.div>
            )}

            {/* Blinking cursor at the end while compiler runs */}
            {step < 6 && step > 0 && (
              <div className="flex items-center mt-1">
                <span className="w-2.5 h-4 bg-[#10b981] animate-pulse" />
              </div>
            )}

            {/* Launching overlay cinematic text */}
            {launching && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm flex items-center justify-center text-brand-gold font-bold text-lg"
              >
                <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                  Launching...
                </motion.span>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
