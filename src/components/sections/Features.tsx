"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Search, 
  Smartphone, 
  Link2, 
  FileText, 
  ShoppingBag, 
  MessageCircleCode 
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "IA Cria Websites",
      desc: "Basta descrever em linguagem natural o seu negócio e a nossa IA constrói o layout, a cópia e o design por si.",
      icon: Sparkles,
      color: "text-amber-400",
      bg: "group-hover:border-amber-500/20"
    },
    {
      title: "Editor Visual",
      desc: "Altere textos, cores, imagens e reorganize as secções com facilidade através de um editor extremamente intuitivo.",
      icon: Layers,
      color: "text-blue-400",
      bg: "group-hover:border-blue-500/20"
    },
    {
      title: "SEO Automático",
      desc: "Metadados, sitemaps e cabeçalhos otimizados para garantir que o seu website se destaca nos motores de pesquisa.",
      icon: Search,
      color: "text-emerald-400",
      bg: "group-hover:border-emerald-500/20"
    },
    {
      title: "Layout Responsivo",
      desc: "Garantia de que o seu website fica absolutamente incrível e rápido em computadores, tablets ou telemóveis.",
      icon: Smartphone,
      color: "text-purple-400",
      bg: "group-hover:border-purple-500/20"
    },
    {
      title: "Domínio Próprio",
      desc: "Ligue facilmente um domínio personalizado (.pt, .com) para passar o máximo de profissionalismo e credibilidade.",
      icon: Link2,
      color: "text-pink-400",
      bg: "group-hover:border-pink-500/20"
    },
    {
      title: "Blog Integrado",
      desc: "Partilhe novidades, publique artigos relevantes e atraia mais clientes de forma orgânica através de um blog moderno.",
      icon: FileText,
      color: "text-sky-400",
      bg: "group-hover:border-sky-500/20"
    },
    {
      title: "Loja Online",
      desc: "Aceite pagamentos e venda produtos digitais ou físicos diretamente através do seu website gerado por IA.",
      icon: ShoppingBag,
      color: "text-indigo-400",
      bg: "group-hover:border-indigo-500/20"
    },
    {
      title: "Chatbot IA",
      desc: "Um assistente inteligente personalizado que atende os visitantes do seu site e responde às perguntas frequentes.",
      icon: MessageCircleCode,
      color: "text-teal-400",
      bg: "group-hover:border-teal-500/20"
    }
  ];

  return (
    <section id="funcionalidades" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">Tudo o que precisas</h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-white">Funcionalidades Premium</p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-gold to-brand-gold-dark mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-4 font-sans">
            Com tecnologia de ponta para automatizar todos os aspetos de concepção, otimização e alojamento de websites.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`group relative rounded-2xl glass-morphism border border-slate-800/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feat.bg} hover:shadow-brand-blue/5`}
              >
                {/* Glow indicator top-right */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-5 border border-white/5 group-hover:border-white/10 group-hover:bg-white/10 transition-colors`}>
                  <Icon className={`w-5 h-5 ${feat.color}`} />
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-gold transition-colors duration-200">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
