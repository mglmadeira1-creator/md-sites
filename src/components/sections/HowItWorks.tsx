"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Cpu, Globe } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Descreve o teu negócio",
      desc: "Indica o nome da marca, o ramo de atividade e uma descrição curta do que fazes. A nossa IA encarrega-se do resto.",
      icon: MessageSquareText,
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400"
    },
    {
      num: "02",
      title: "A IA cria tudo por ti",
      desc: "Em segundos, a IA gera toda a estrutura do site, o design moderno, os textos otimizados para conversão, imagens relevantes e configuração básica de SEO.",
      icon: Cpu,
      color: "from-brand-gold/20 to-brand-gold-dark/10",
      iconColor: "text-brand-gold"
    },
    {
      num: "03",
      title: "Publica instantaneamente",
      desc: "Reformula os pormenores que pretenderes no nosso editor visual e publica o teu website na internet com um clique.",
      icon: Globe,
      color: "from-emerald-500/20 to-emerald-600/10",
      iconColor: "text-emerald-400"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 relative overflow-hidden bg-brand-blue-dark/50">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">Fluxo Simplificado</h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-white">Como Funciona?</p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-gold to-brand-gold-dark mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-4">
            Desenvolvemos um processo inteligente onde qualquer pessoa consegue ter uma presença digital de topo sem precisar de programar.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative group rounded-2xl glass-morphism border border-slate-800/80 p-8 hover:border-brand-gold/20 transition-all duration-300"
              >
                {/* Number badge */}
                <div className="absolute top-4 right-6 text-6xl font-display font-black text-slate-800/40 select-none group-hover:text-brand-gold/10 transition-colors">
                  {step.num}
                </div>

                {/* Icon wrapper with glow background */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 border border-white/5`}>
                  <Icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>

                {/* Sub-features for step 2 specifically */}
                {idx === 1 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-gold" />
                      Design Premium
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-gold" />
                      Textos Otimizados
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-gold" />
                      Imagens Relevantes
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-gold" />
                      SEO Integrado
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
