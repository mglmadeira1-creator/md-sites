"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Star, Mail, Phone, MapPin, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

interface WebsiteData {
  id: string;
  name: string;
  category: string;
  description: string;
  palette: string;
  features: string[];
  url: string;
  status: string;
}

export default function PublicSitePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const subdomain = resolvedParams.subdomain;

  const [site, setSite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const { data, error } = await supabase
          .from("websites")
          .select("*")
          .or(`url.ilike.${subdomain}.mdsites.app,url.eq.${subdomain}`)
          .single();

        if (!error && data) {
          setSite(data as WebsiteData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do website público:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <span className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-brand-gold animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">404 - Website Não Encontrado</h1>
        <p className="text-slate-400 max-w-md">O endereço do website que tenta aceder não está registado no nosso sistema ou foi removido.</p>
        <a href="https://mdsites.app" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-sm shadow-md">
          Criar o meu Website com IA
        </a>
      </div>
    );
  }

  // Resolução do tema baseado no registo da DB
  const getThemeClasses = () => {
    switch (site.palette) {
      case "emerald-dark":
        return {
          bg: "bg-[#022c22]",
          card: "bg-[#064e3b]/85 border-[#10b981]/20",
          textAccent: "text-[#10b981]",
          textMuted: "text-emerald-250",
          title: "text-white font-extrabold",
          subtitle: "text-emerald-100",
          btnAccent: "bg-[#10b981] hover:bg-[#059669] text-white",
          btnOutline: "border-[#10b981]/30 hover:bg-[#10b981]/10 text-white"
        };
      case "indigo-purple":
        return {
          bg: "bg-[#0f172a]",
          card: "bg-[#1e1b4b]/85 border-[#6366f1]/20",
          textAccent: "text-[#6366f1]",
          textMuted: "text-indigo-250",
          title: "text-white font-extrabold",
          subtitle: "text-indigo-100",
          btnAccent: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
          btnOutline: "border-[#6366f1]/30 hover:bg-[#6366f1]/10 text-white"
        };
      case "mono-light":
        return {
          bg: "bg-slate-50",
          card: "bg-white border-slate-200 shadow-sm",
          textAccent: "text-slate-900",
          textMuted: "text-slate-600",
          title: "text-slate-900 font-extrabold",
          subtitle: "text-slate-700",
          btnAccent: "bg-slate-900 hover:bg-slate-800 text-white",
          btnOutline: "border-slate-350 hover:bg-slate-100 text-slate-800"
        };
      case "blue-gold":
      default:
        return {
          bg: "bg-[#0a0f1d]",
          card: "bg-[#111827]/85 border-[#d4af37]/20",
          textAccent: "text-[#d4af37]",
          textMuted: "text-slate-450",
          title: "text-white font-extrabold",
          subtitle: "text-slate-300",
          btnAccent: "bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-slate-900 font-extrabold",
          btnOutline: "border-[#d4af37]/30 hover:bg-[#d4af37]/10 text-white"
        };
    }
  };

  const theme = getThemeClasses();

  // Elementos do template gerado baseado no sector
  const getGeneratedContent = () => {
    let heroTitle = `Soluções inteligentes para ${site.name}`;
    let heroSubtitle = site.description;
    let services = [
      { name: "Consultoria Premium", desc: "Aconselhamento estratégico personalizado para otimizar os seus resultados." },
      { name: "Gestão Integrada", desc: "Tratamos dos processos complexos para que se foque no que realmente importa." },
      { name: "Suporte Dedicado", desc: "A nossa equipa técnica está sempre disponível para assegurar a máxima estabilidade." }
    ];

    if (site.category.includes("Restaurante") || site.category.includes("Cafetaria")) {
      heroTitle = `Bem-vindo ao ${site.name}`;
      heroSubtitle = `Uma experiência gastronómica inesquecível. ${site.description}`;
      services = [
        { name: "Menu de Degustação", desc: "Pratos de autor confecionados com ingredientes frescos e locais." },
        { name: "Eventos Privados", desc: "Espaço sofisticado para celebrar momentos marcantes." },
        { name: "Serviço de Reservas", desc: "Garanta a sua mesa com facilidade e desfrute de um atendimento exclusivo." }
      ];
    } else if (site.category.includes("Tecnologia") || site.category.includes("SaaS")) {
      heroTitle = `Acelere o seu negócio com ${site.name}`;
      heroSubtitle = `A tecnologia que simplifica o seu fluxo de trabalho de forma automatizada. ${site.description}`;
      services = [
        { name: "Automação Avançada", desc: "Elimine tarefas manuais repetitivas e ganhe horas de produtividade diária." },
        { name: "Painel de Métricas", desc: "Dados consolidados em tempo real para tomada de decisões estratégicas." },
        { name: "Segurança de Dados", desc: "Criptografia avançada de ponta a ponta para proteger a sua informação." }
      ];
    } else if (site.category.includes("Saúde") || site.category.includes("Estética")) {
      heroTitle = `Cuide de si no ${site.name}`;
      heroSubtitle = `Tratamentos e cuidados de excelência focados no seu bem-estar. ${site.description}`;
      services = [
        { name: "Tratamentos Especializados", desc: "Procedimentos modernos realizados por profissionais experientes." },
        { name: "Consultas de Avaliação", desc: "Diagnóstico completo e plano de tratamento ajustado às suas necessidades." },
        { name: "Produtos Premium", desc: "Utilização exclusiva de marcas conceituadas de elevada qualidade dermatológica." }
      ];
    }

    return { heroTitle, heroSubtitle, services };
  };

  const content = getGeneratedContent();

  const isLight = site.palette === "mono-light";

  return (
    <div className={`min-h-screen ${theme.bg} ${isLight ? "text-slate-800" : "text-slate-200"} font-sans transition-colors duration-300`}>
      {/* Header / Navbar */}
      <header className={`sticky top-0 z-45 border-b backdrop-blur-md px-6 py-4 flex items-center justify-between ${
        isLight ? "border-slate-200/60 bg-white/70" : "border-white/5 bg-[#030712]/50"
      }`}>
        <div className={`font-bold text-lg flex items-center gap-1.5 font-display select-none ${isLight ? "text-slate-900" : "text-white"}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
          {site.name}
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold select-none">
          <a href="#inicio" className={`hover:${theme.textAccent} transition-colors`}>Início</a>
          {site.features.includes("servicos") && <a href="#servicos" className={`hover:${theme.textAccent} transition-colors`}>Serviços</a>}
          {site.features.includes("galeria") && <a href="#galeria" className={`hover:${theme.textAccent} transition-colors`}>Galeria</a>}
          {site.features.includes("depoimentos") && <a href="#depoimentos" className={`hover:${theme.textAccent} transition-colors`}>Testemunhos</a>}
          {site.features.includes("faq") && <a href="#faq" className={`hover:${theme.textAccent} transition-colors`}>FAQ</a>}
          {site.features.includes("contactos") && <a href="#contactos" className={`hover:${theme.textAccent} transition-colors`}>Contacto</a>}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-24 px-6 max-w-4xl mx-auto text-center space-y-8">
        <div className={`inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold ${
          isLight ? "bg-slate-200/80 text-slate-800" : "bg-white/5 border border-white/10 text-white"
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          {site.category}
        </div>
        <h1 className={`text-4xl sm:text-5xl font-display font-extrabold leading-tight ${theme.title}`}>
          {content.heroTitle}
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${theme.subtitle}`}>
          {content.heroSubtitle}
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="#servicos" className={`px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-transform hover:scale-[1.02] ${theme.btnAccent}`}>
            Conhecer Serviços
          </a>
          <a href="#contactos" className={`px-6 py-3 rounded-xl text-sm font-bold border transition-colors ${theme.btnOutline}`}>
            Falar Connosco
          </a>
        </div>
      </section>

      {/* Services Section */}
      {site.features.includes("servicos") && (
        <section id="servicos" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>Os Nossos Serviços</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Como podemos ajudar o seu negócio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.services.map((srv, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${theme.card}`}>
                <div className="space-y-2">
                  <h4 className={`text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{srv.name}</h4>
                  <p className="text-xs text-slate-450 leading-relaxed">{srv.desc}</p>
                </div>
                <div className={`text-xs font-semibold ${theme.textAccent}`}>Saber mais →</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {site.features.includes("galeria") && (
        <section id="galeria" className="py-20 px-6 max-w-5xl mx-auto space-y-12 border-t border-slate-800/10">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>Portfólio / Galeria</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Amostras do nosso trabalho recente</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`aspect-video rounded-xl flex items-center justify-center border text-xs font-semibold ${theme.card}`}>
                Projeto {i} - Imagem Ilustrativa
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {site.features.includes("depoimentos") && (
        <section id="depoimentos" className="py-20 px-6 max-w-4xl mx-auto space-y-12 border-t border-slate-800/10">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>O que Dizem os Nossos Clientes</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Opiniões de quem confia em nós</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Maria Silva", text: "Excelente profissionalismo e rapidez. O resultado final superou as expectativas." },
              { name: "João Santos", text: "Processo extremamente simples e um acompanhamento fantástico em todas as fases." }
            ].map((dep, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border space-y-4 ${theme.card}`}>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">"{dep.text}"</p>
                <div className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{dep.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {site.features.includes("faq") && (
        <section id="faq" className="py-20 px-6 max-w-3xl mx-auto space-y-12 border-t border-slate-800/10">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>Perguntas Frequentes</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Respostas rápidas às suas dúvidas</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Quais são os vossos prazos de entrega?", a: "Dependendo da dimensão do projeto, tipicamente realizamos a entrega final num prazo de 3 a 7 dias úteis." },
              { q: "Posso solicitar alterações após a publicação?", a: "Sim, oferecemos suporte contínuo para atualizações e ajustes rápidos conforme necessário." }
            ].map((faq, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border space-y-2 ${theme.card}`}>
                <h4 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{faq.q}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contacts Section */}
      {site.features.includes("contactos") && (
        <section id="contactos" className="py-20 px-6 max-w-md mx-auto space-y-8 border-t border-slate-800/10">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>Entre em Contacto</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Estamos aqui para responder às suas questões</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nome" className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-brand-gold/50 bg-black/5 ${
              isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
            }`} />
            <input type="email" placeholder="Email" className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-brand-gold/50 bg-black/5 ${
              isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
            }`} />
            <textarea rows={3} placeholder="Mensagem..." className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-brand-gold/50 bg-black/5 resize-none ${
              isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
            }`} />
            <button className={`w-full py-3 rounded-xl text-xs font-bold ${theme.btnAccent}`}>
              Enviar Mensagem
            </button>
          </form>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-12 px-6 border-t text-center text-xs ${
        isLight ? "border-slate-200/60 text-slate-500" : "border-white/5 text-slate-500"
      }`}>
        <p suppressHydrationWarning>&copy; {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
        <p className="mt-1 text-[10px]">Website gerado automaticamente com IA de MD Sites.</p>
      </footer>
    </div>
  );
}
