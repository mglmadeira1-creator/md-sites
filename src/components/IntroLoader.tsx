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
  
  const fullCommand = "❯ md-sites deploy --ai";

  // Typewriter effect for command line
  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < fullCommand.length) {
        setTypedCommand(prev => prev + fullCommand[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setStep(1); // Start sequence once command is typed
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Sequence control
  useEffect(() => {
    if (step === 0) return;

    if (step === 1) {
      // Step 1: Progress from 0 to 12%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 12) return prev + 1;
          clearInterval(interval);
          setTimeout(() => setStep(2), 500);
          return prev;
        });
      }, 30);
    } 
    else if (step === 2) {
      // Step 2: Progress from 12 to 45%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 45) return prev + 2;
          clearInterval(interval);
          setTimeout(() => setStep(3), 500);
          return prev;
        });
      }, 20);
    }
    else if (step === 3) {
      // Step 3: Progress from 45 to 75%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 75) return prev + 2;
          clearInterval(interval);
          setTimeout(() => setStep(4), 500);
          return prev;
        });
      }, 25);
    }
    else if (step === 4) {
      // Step 4: Progress from 75 to 100%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) return prev + 2;
          clearInterval(interval);
          setTimeout(() => setStep(5), 600);
          return prev;
        });
      }, 20);
    }
    else if (step === 5) {
      // Final waiting before completing
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Render visual progress block string
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
      transition={{ duration: 0.6, ease: "easeInOut" }}
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

      {/* Terminal Window Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl mx-4 rounded-2xl p-[1.5px] relative"
        style={{
          background: "linear-gradient(225deg, #D4AF37 0%, #D4AF37 40%, #3b82f6 60%, #3b82f6 100%)",
          boxShadow: `
            -15px 15px 50px -10px rgba(59, 130, 246, 0.45), 
            15px -15px 50px -10px rgba(212, 175, 55, 0.35)
          `
        }}
      >
        <div className="w-full rounded-[15px] overflow-hidden backdrop-blur-lg bg-slate-950/90 flex flex-col justify-start">
          
          {/* Glass Glossy reflection overlay */}
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
          <div className="p-6 font-mono text-xs sm:text-sm text-[#10b981] space-y-4 min-h-[300px] flex flex-col justify-start">
            
            {/* Typed command line */}
            <div className="text-slate-100 font-bold flex items-center">
              <span>{typedCommand}</span>
              {step === 0 && (
                <span className="inline-block w-2.5 h-4 ml-1 bg-slate-100 animate-pulse" />
              )}
            </div>

            {/* Simulated progress blocks */}
            {step > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-1.5"
              >
                <div className="text-slate-300">
                  {getProgressBlocks(progress)} {progress}%
                </div>
              </motion.div>
            )}

            {/* Checklist elements */}
            <div className="space-y-2 pt-2">
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Branding</span>
                </motion.div>
              )}
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Cores</span>
                </motion.div>
              )}
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">SEO</span>
                </motion.div>
              )}

              {/* Step 1 dynamic check / spinner */}
              {step === 1 && (
                <div className="flex items-center gap-2 text-brand-gold font-bold">
                  <span className="animate-spin">⟳</span>
                  <span>Landing Page</span>
                </div>
              )}
              {step >= 2 && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Landing Page</span>
                </motion.div>
              )}

              {/* Step 2 dynamic check / spinner */}
              {step === 2 && (
                <div className="flex items-center gap-2 text-brand-gold font-bold">
                  <span className="animate-spin">⟳</span>
                  <span>Conteúdo</span>
                </div>
              )}
              {step >= 3 && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Conteúdo</span>
                </motion.div>
              )}

              {/* Step 3 dynamic check / spinner */}
              {step === 3 && (
                <div className="flex items-center gap-2 text-brand-gold font-bold">
                  <span className="animate-spin">⟳</span>
                  <span>Otimização</span>
                </div>
              )}
              {step >= 4 && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Otimização</span>
                </motion.div>
              )}
            </div>

            {/* Finished build log */}
            {step >= 5 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="pt-4 text-emerald-400 font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4.5 h-4.5 text-brand-gold animate-bounce" />
                <span>Website Ready.</span>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
