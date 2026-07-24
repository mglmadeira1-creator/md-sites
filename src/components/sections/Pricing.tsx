"use client";

import { motion } from "framer-motion";
import { Check, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Básico",
      price: "0",
      desc: "Ideal para testar a plataforma e criar pequenos websites experimentais.",
      features: [
        "1 Website gerado por IA",
        "Subdomínio .mdsites.app",
        "Alojamento gratuito",
        "Editor visual básico",
        "Certificado SSL grátis"
      ],
      cta: "Começar Grátis",
      popular: false,
      href: "/simular"
    },
    {
      name: "Pro",
      price: "15",
      desc: "A melhor escolha para profissionais, freelancers e negócios em expansão.",
      features: [
        "Websites gerados ilimitados",
        "Domínio próprio personalizado",
        "Editor visual avançado",
        "Sem publicidade MD Sites",
        "Suporte prioritário 24/7",
        "SEO Automático e Avançado",
        "Integração de Blog"
      ],
      cta: "Experimentar Pro",
      popular: true,
      href: "/simular?plan=pro"
    },
    {
      name: "Agência",
      price: "49",
      desc: "Desenvolvido para equipas e agências que gerem múltiplos clientes.",
      features: [
        "Tudo do plano Pro",
        "Suporte telefónico dedicado",
        "Integrações de API",
        "Exportação de código HTML/CSS",
        "Modelos de IA personalizados",
        "Funcionalidade de Loja Online",
        "Chatbot IA personalizado"
      ],
      cta: "Contactar Vendas",
      popular: false,
      href: "/simular?plan=agency"
    }
  ];

  return (
    <section id="precos" className="py-24 relative overflow-hidden bg-brand-blue-dark/30">
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">Preços Justos</h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-white">Planos flexíveis para o teu negócio</p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-gold to-brand-gold-dark mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-4">
            Escolhe o plano ideal e começa a construir a tua presença digital hoje mesmo. Sem fidelizações.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-2xl p-8 glass-morphism border flex flex-col justify-between transition-all duration-300 ${
                plan.popular 
                  ? "border-brand-gold glow-gold scale-105 z-10 md:-translate-y-2 bg-[#0d1527]/85" 
                  : "border-slate-800/80 hover:border-slate-700/60"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Mais Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-display font-extrabold text-white">{plan.price}€</span>
                  <span className="text-sm text-slate-400">/mês</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-brand-gold" : "text-emerald-400"}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href={plan.href}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark hover:shadow-lg hover:shadow-brand-gold/10 font-bold"
                      : "bg-white/5 border border-slate-700 hover:bg-white/10 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
