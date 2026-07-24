"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Paintbrush, 
  Image as ImageIcon, 
  Smartphone, 
  PenTool, 
  LineChart, 
  Share2, 
  Mail, 
  FileText, 
  Video, 
  Package, 
  ChevronLeft, 
  Check, 
  Download,
  AlertCircle,
  RefreshCw,
  Eye,
  Rocket
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Website {
  id: string;
  name: string;
  url: string;
  palette: string;
  features: string[];
  description: string;
}

export default function AIStudioPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebId, setSelectedWebId] = useState<string>("");
  const [loadingWebs, setLoadingWebs] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // States inside Generators
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Logo Generator Form
  const [logoName, setLogoName] = useState("");
  const [logoSlogan, setLogoSlogan] = useState("");
  const [logoCategory, setLogoCategory] = useState("");
  const [logoStyle, setLogoStyle] = useState("Minimalista");
  const [logoColor, setLogoColor] = useState("Gold");
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [selectedLogoIdx, setSelectedLogoIdx] = useState<number | null>(null);

  // Branding Form
  const [brandMood, setBrandMood] = useState("Sofisticado & Luxuoso");
  const [generatedBranding, setGeneratedBranding] = useState<any | null>(null);

  // Image Generator Form
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgType, setImgType] = useState("Hero Image");
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string>("");

  // PWA Converter
  const [pwaStatus, setPwaStatus] = useState<"idle" | "converting" | "ready">("idle");

  // Copywriting Form
  const [copyType, setCopyType] = useState("Página Inicial");
  const [generatedCopy, setGeneratedCopy] = useState("");

  // SEO Form
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [generatedSEO, setGeneratedSEO] = useState<any | null>(null);

  // Social Media Form
  const [socialPlatform, setSocialPlatform] = useState("Instagram");
  const [generatedSocial, setGeneratedSocial] = useState("");

  // Marketing Form
  const [marketType, setMarketType] = useState("Slogans Criativos");
  const [generatedMarket, setGeneratedMarket] = useState<string[]>([]);

  // Legal Docs Form
  const [docType, setDocType] = useState("Política de Privacidade");
  const [generatedDoc, setGeneratedDoc] = useState("");

  // Video Script Form
  const [videoPrompt, setVideoPrompt] = useState("");
  const [generatedVideoScript, setGeneratedVideoScript] = useState("");

  // Product Copy Form
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [generatedProd, setGeneratedProd] = useState<any | null>(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const { data, error } = await supabase
          .from("websites")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) {
          setWebsites(data as Website[]);
          if (data.length > 0) {
            setSelectedWebId(data[0].id);
            setLogoName(data[0].name);
            setLogoCategory(data[0].category);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar sites no AI Studio:", err);
      } finally {
        setLoadingWebs(false);
      }
    };
    fetchWebsites();
  }, []);

  const handleApplyToWebsite = async (featureName: string, dataToApply: any) => {
    if (!selectedWebId) {
      alert("Por favor, selecione um website ativo para aplicar este recurso.");
      return;
    }
    setGenerating(true);
    try {
      if (featureName === "logo") {
        // Mock application of logo to assets table
        await supabase.from("assets").insert([
          {
            website_id: selectedWebId,
            file_name: `logo_${logoName.toLowerCase().replace(/[^a-z0-9]/g, "")}.svg`,
            file_url: dataToApply,
            mime_type: "image/svg+xml"
          }
        ]);
      } else if (featureName === "branding") {
        // Apply visual palette change
        await supabase
          .from("websites")
          .update({ palette: dataToApply.paletteCode })
          .eq("id", selectedWebId);
      } else if (featureName === "seo") {
        // Apply SEO details to settings table
        await supabase
          .from("settings")
          .upsert({
            website_id: selectedWebId,
            seo_title: dataToApply.title,
            seo_description: dataToApply.description
          });
      } else if (featureName === "copy") {
        // Update website description
        await supabase
          .from("websites")
          .update({ description: dataToApply.substring(0, 300) })
          .eq("id", selectedWebId);
      }

      setSuccessMsg(`Sucesso! O recurso foi aplicado diretamente ao website "${websites.find(w => w.id === selectedWebId)?.name}".`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Mock Generators
  const generateLogoProposals = () => {
    setGenerating(true);
    setTimeout(() => {
      // 4 different inline SVG shapes centered as Proposals
      const colorsMap: any = {
        Gold: "#D4AF37",
        Blue: "#3B82F6",
        Emerald: "#10B981",
        Purple: "#8B5CF6",
        Crimson: "#EF4444"
      };
      const mainColor = colorsMap[logoColor] || "#D4AF37";
      
      const p1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="35" stroke="${mainColor}" stroke-width="4"/><path d="M35 50 L65 50 M50 35 L50 65" stroke="${mainColor}" stroke-width="4"/><text x="50" y="85" fill="white" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">${logoName}</text></svg>`;
      const p2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect x="25" y="25" width="50" height="50" rx="8" stroke="${mainColor}" stroke-width="5"/><path d="M40 38 L60 50 L40 62 Z" fill="${mainColor}"/><text x="50" y="90" fill="white" font-size="8" font-family="sans-serif" text-anchor="middle" font-weight="bold">${logoName.toUpperCase()}</text></svg>`;
      const p3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path d="M50 15 L85 75 L15 75 Z" stroke="${mainColor}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="52" r="12" fill="${mainColor}"/><text x="50" y="92" fill="${mainColor}" font-size="9" font-family="monospace" text-anchor="middle">${logoName}</text></svg>`;
      const p4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path d="M20 30 C 35 10, 65 10, 80 30 C 95 50, 75 80, 50 90 C 25 80, 5 50, 20 30 Z" stroke="${mainColor}" stroke-width="3"/><text x="50" y="55" fill="white" font-size="16" font-family="sans-serif" text-anchor="middle" font-weight="extrabold">${logoName.slice(0,2).toUpperCase()}</text></svg>`;
      
      setGeneratedLogos([p1, p2, p3, p4]);
      setSelectedLogoIdx(0);
      setGenerating(false);
    }, 1200);
  };

  const generateBrandingKit = () => {
    setGenerating(true);
    setTimeout(() => {
      const paletteCode = brandMood.includes("Luxuoso") ? "blue-gold" : brandMood.includes("Ecológico") ? "emerald-dark" : "indigo-purple";
      setGeneratedBranding({
        mood: brandMood,
        paletteCode,
        primaryColor: paletteCode === "blue-gold" ? "#D4AF37" : paletteCode === "emerald-dark" ? "#10B981" : "#6366F1",
        secondaryColor: "#1E293B",
        fonts: {
          display: "Outfit / Syne",
          sans: "Inter / Plus Jakarta Sans"
        },
        icons: "Lucide Minimalist Outlined",
        styling: "Glassmorphism premium, sombras suaves, glows de foco"
      });
      setGenerating(false);
    }, 1000);
  };

  const generateImageMock = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedImgUrl("/fundo-paginas.png");
      setGenerating(false);
    }, 1200);
  };

  const runPwaConversion = () => {
    setPwaStatus("converting");
    setTimeout(() => {
      setPwaStatus("ready");
    }, 2000);
  };

  const generateCopywrite = () => {
    setGenerating(true);
    setTimeout(() => {
      let text = `Bem-vindo à ${logoName || "nossa empresa"}!\n\nProporcionamos soluções inovadoras no sector de ${logoCategory || "Serviços"}. A nossa missão é impulsionar os seus resultados com profissionalismo, qualidade e dedicação total às suas necessidades. Fale connosco hoje mesmo e descubra como podemos ajudar a sua marca a atingir o próximo nível.`;
      if (copyType === "Serviços") {
        text = `Os Nossos Serviços na ${logoName || "nossa empresa"}:\n\n1. Consultoria Estratégica: Orientação especializada para otimizar os seus processos.\n2. Integração Digital: Modernização das suas ferramentas de trabalho.\n3. Suporte Dedicado: Monitorização 24/7 para máxima paz de espírito.`;
      } else if (copyType === "FAQ") {
        text = `Perguntas Frequentes (FAQ):\n\nQ: Como posso iniciar o projeto?\nA: O processo é 100% online. Inicie uma simulação ou fale connosco pelo formulário.\n\nQ: Qual é o prazo de entrega?\nA: Os nossos websites e recursos padrão são ativados em apenas 3 a 7 dias úteis.`;
      }
      setGeneratedCopy(text);
      setGenerating(false);
    }, 1000);
  };

  const generateSEOData = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedSEO({
        title: `${logoName || "Website"} | Soluções Avançadas de ${logoCategory || "Serviços"}`,
        description: `Procura por excelência em ${logoCategory || "Serviços"}? Conheça a ${logoName || "nossa empresa"} e revolucione o seu negócio. Fale connosco.`,
        keywords: `${logoName}, ${logoCategory}, Portugal, Profissional, IA, Criação Automática`,
        ogType: "website",
        twitterCard: "summary_large_image"
      });
      setGenerating(false);
    }, 1000);
  };

  const generateSocialPost = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedSocial(`🚀 Novidade Incrível! A ${logoName || "nossa marca"} acaba de lançar novas soluções dedicadas a ${logoCategory || "Serviços"}.\n\nSe procura aumentar a eficiência e dar um salto de qualidade, visite o nosso novo website em https://${websites.find(w => w.id === selectedWebId)?.url || "mdsites.app"}.\n\n#Inovação #Negócios #Sucesso #IA`);
      setGenerating(false);
    }, 900);
  };

  const generateMarketingCampaigns = () => {
    setGenerating(true);
    setTimeout(() => {
      if (marketType === "Slogans Criativos") {
        setGeneratedMarket([
          `Acelere com a ${logoName}`,
          `O futuro do seu negócio começa na ${logoName}`,
          `Soluções inteligentes, resultados reais.`,
          `Líderes em inovação de ${logoCategory}`
        ]);
      } else {
        setGeneratedMarket([
          `Assunto: Dê o salto que a sua marca precisa com a ${logoName}!\n\nOlá!\nQueremos apresentar as novas soluções automáticas para o seu negócio...`
        ]);
      }
      setGenerating(false);
    }, 1100);
  };

  const generateLegalDocuments = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedDoc(`POLÍTICA DE PRIVACIDADE - ${logoName.toUpperCase()}\n\nEste documento detalha como a ${logoName} recolhe e processa os dados dos seus utilizadores de acordo com as diretivas do RGPD em Portugal. Recolhemos apenas dados de contacto voluntários fornecidos pelo formulário. Os seus dados nunca serão vendidos a terceiros.`);
      setGeneratedDoc(prev => prev + `\n\nPOLÍTICA DE COOKIES\nUtilizamos cookies técnicos essenciais para melhorar a sua navegação e analisar métricas de visitas anónimas.`);
      setGenerating(false);
    }, 1000);
  };

  const generateVideoScriptDraft = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedVideoScript(`[Cena 1 - Ecrã Escuro, Música Inspiradora]\nLocutor: O seu negócio de ${logoCategory} merece mais visibilidade.\n\n[Cena 2 - Imagens de Equipa e Tecnologia]\nLocutor: Apresentamos a ${logoName}. A solução moderna que estava à procura.\n\n[Cena 3 - Logótipo e Website da Marca]\nLocutor: Visite-nos em ${websites.find(w => w.id === selectedWebId)?.url || "mdsites.app"} e comece hoje.`);
      setGenerating(false);
    }, 1200);
  };

  const generateProductSpecs = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedProd({
        title: `${prodName || "Produto Premium"} - Edição Otimizada`,
        descShort: `O melhor recurso para acelerar a sua produtividade no sector de ${logoCategory}.`,
        descLong: `Concebido por especialistas, o ${prodName || "Produto"} oferece fiabilidade máxima, facilidade de utilização diária e uma performance incrível. A sua escolha número um.`,
        benefits: ["Performance Ultra Rápida", "Segurança Integrada", "Suporte Premium 24/7"]
      });
      setGenerating(false);
    }, 1100);
  };

  const modules = [
    { id: "logo", name: "Gerador de Logótipos", desc: "Crie propostas de logótipos em SVG e descarregue em múltiplos formatos.", icon: Paintbrush },
    { id: "branding", name: "Branding & Marca", desc: "Defina a identidade visual, paletas de cores e kits de marca da empresa.", icon: Sparkles },
    { id: "imagens", name: "Gerador de Imagens", desc: "Gere Hero images, banners e backgrounds sob medida.", icon: ImageIcon },
    { id: "apps", name: "Converter em App", desc: "Transforme o seu website numa aplicação móvel PWA instalável.", icon: Smartphone },
    { id: "escrita", name: "Escrita Inteligente", desc: "Redija conteúdos completos, FAQs, blogs e secções de serviços.", icon: PenTool },
    { id: "seo", name: "SEO Automático", desc: "Gere títulos, meta descrições, tags Open Graph e sitemaps.", icon: LineChart },
    { id: "social", name: "Redes Sociais", desc: "Crie publicações persuasivas para Instagram, LinkedIn e Facebook.", icon: Share2 },
    { id: "marketing", name: "Marketing & Slogans", desc: "Descubra slogans cativantes e campanhas de email marketing.", icon: Mail },
    { id: "legal", name: "Documentos Legais", desc: "Gere termos de uso, políticas de privacidade e cookies em conformidade com o RGPD.", icon: FileText },
    { id: "videos", name: "Guiões de Vídeo", desc: "Escreva guiões técnicos para vídeos promocionais, reels e shorts.", icon: Video },
    { id: "produtos", name: "Fichas de Produto", desc: "Crie títulos, descrições longas e listas de benefícios de e-commerce.", icon: Package }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header section with active site indicator */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white">AI Studio 🤖</h1>
          <p className="text-slate-400 text-sm mt-1">Crie a sua marca, logótipos, imagens e conteúdos com inteligência artificial.</p>
        </div>

        {/* Website Selector Dropdown */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
          <span className="text-xs text-slate-400 font-semibold select-none">Website Ativo:</span>
          {loadingWebs ? (
            <span className="text-xs text-slate-500">A carregar...</span>
          ) : websites.length === 0 ? (
            <span className="text-xs text-brand-gold font-bold">Nenhum criado</span>
          ) : (
            <select 
              value={selectedWebId} 
              onChange={(e) => {
                const id = e.target.value;
                setSelectedWebId(id);
                const w = websites.find(item => item.id === id);
                if (w) {
                  setLogoName(w.name);
                  setLogoCategory(w.description ? w.description.slice(0,30) : "");
                }
              }}
              className="bg-transparent text-white text-xs font-bold focus:outline-none border-none cursor-pointer"
            >
              {websites.map(web => (
                <option key={web.id} value={web.id} className="bg-slate-950 text-white">
                  {web.name} ({web.url})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Success banner notifications */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid View */}
      {activeModule === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setActiveModule(mod.id)}
                className="rounded-2xl glass-morphism border border-slate-800/80 p-6 flex flex-col justify-between hover:border-brand-gold/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all duration-300 group cursor-pointer h-[200px]"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-brand-gold/20 group-hover:bg-brand-gold/5 transition-colors">
                    <Icon className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-brand-gold transition-colors">{mod.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{mod.desc}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold group-hover:text-white transition-colors text-right">
                  Abrir Módulo →
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* SPECIALIZED ACTIVE MODULE PANEL VIEWS */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl glass-morphism border border-slate-800/80 p-6 space-y-6"
        >
          {/* Active Module Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button 
              onClick={() => setActiveModule(null)} 
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-all py-1.5 px-3 rounded-lg bg-white/5 border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar ao AI Studio
            </button>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              {modules.find(m => m.id === activeModule)?.name}
            </h2>
          </div>

          {/* 1. LOGO GENERATOR SCREEN */}
          {activeModule === "logo" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Configurar Logótipo</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nome da Marca</label>
                    <input 
                      type="text" 
                      value={logoName} 
                      onChange={(e) => setLogoName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-gold/30" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Slogan (Opcional)</label>
                    <input 
                      type="text" 
                      value={logoSlogan} 
                      onChange={(e) => setLogoSlogan(e.target.value)}
                      placeholder="Ex: Qualidade Garantida"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Área de Negócio</label>
                    <input 
                      type="text" 
                      value={logoCategory} 
                      onChange={(e) => setLogoCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estilo Visual</label>
                      <select 
                        value={logoStyle} 
                        onChange={(e) => setLogoStyle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                      >
                        {["Minimalista", "Moderno", "Premium", "Vintage", "Luxo", "Tecnológico"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cor Principal</label>
                      <select 
                        value={logoColor} 
                        onChange={(e) => setLogoColor(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                      >
                        {["Gold", "Blue", "Emerald", "Purple", "Crimson"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={generateLogoProposals}
                  disabled={generating || !logoName}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      A criar propostas...
                    </>
                  ) : "Gerar Logótipo com IA"}
                </button>
              </div>

              {/* Logo Preview Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                {generatedLogos.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Preencha os campos e clique em Gerar para ver 4 propostas de marcas criadas pela IA.</p>
                ) : (
                  <div className="w-full space-y-6">
                    <h4 className="text-xs font-bold text-white">Selecione uma Proposta:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {generatedLogos.map((svg, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedLogoIdx(idx)}
                          className={`aspect-square rounded-xl border p-4 bg-slate-900 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.03] ${
                            selectedLogoIdx === idx ? "border-brand-gold bg-brand-gold/5 shadow-md shadow-brand-gold/10" : "border-slate-800"
                          }`}
                        >
                          <div className="w-20 h-20 text-white" dangerouslySetInnerHTML={{ __html: svg }} />
                          <span className="text-[10px] font-bold mt-2 text-slate-400">Proposta {idx + 1}</span>
                        </div>
                      ))}
                    </div>

                    {selectedLogoIdx !== null && (
                      <div className="flex gap-3 justify-center pt-2">
                        <button 
                          onClick={() => handleApplyToWebsite("logo", generatedLogos[selectedLogoIdx])}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white border border-slate-800"
                        >
                          Aplicar ao Website
                        </button>
                        <button 
                          onClick={() => alert("SVG downloaded successfully!")}
                          className="px-4 py-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark rounded-lg text-xs font-extrabold flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Descarregar SVG
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. BRANDING MODULE SCREEN */}
          {activeModule === "branding" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Identidade da Marca</h3>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Espírito da Marca (Mood)</label>
                  <select 
                    value={brandMood} 
                    onChange={(e) => setBrandMood(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    {["Sofisticado & Luxuoso", "Ecológico & Natural", "Jovem & Enérgico", "Minimalista Técnico"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <button 
                  onClick={generateBrandingKit}
                  disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Kit de Marca"}
                </button>
              </div>

              {/* Branding Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px]">
                {!generatedBranding ? (
                  <p className="text-xs text-slate-500 italic text-center">Clique em Gerar para produzir paletas, famílias de fontes e ícones coordenados com IA.</p>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white">Identidade Gerada:</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-slate-400">Paleta Recomendada:</span>
                        <span className="font-mono text-white flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full inline-block border border-white/10" style={{ backgroundColor: generatedBranding.primaryColor }} />
                          {generatedBranding.paletteCode}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-slate-400">Fontes Recomendadas:</span>
                        <span className="text-white font-bold">{generatedBranding.fonts.display}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-slate-400">Tipografia Corpo:</span>
                        <span className="text-white font-bold">{generatedBranding.fonts.sans}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-slate-400">Tom de Comunicação:</span>
                        <span className="text-white font-bold">{generatedBranding.mood}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-400">Elementos Gráficos:</span>
                        <span className="text-white font-bold">{generatedBranding.styling}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleApplyToWebsite("branding", generatedBranding)}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-slate-800 rounded-xl transition-all"
                    >
                      Aplicar Branding ao Website
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. IMAGE GENERATOR SCREEN */}
          {activeModule === "imagens" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Criar Imagem com IA</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Prompt da Imagem</label>
                    <textarea 
                      rows={3}
                      value={imgPrompt}
                      onChange={(e) => setImgPrompt(e.target.value)}
                      placeholder="Ex: Um escritório moderno futurista com tons azuis e iluminação quente minimalista, alta resolução"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none resize-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tipo de Imagem</label>
                    <select 
                      value={imgType} 
                      onChange={(e) => setImgType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    >
                      {["Hero Image", "Banner", "Background", "Produto", "Equipa", "Loja"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={generateImageMock}
                  disabled={generating || !imgPrompt}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Imagem"}
                </button>
              </div>

              {/* Image Preview Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col items-center justify-center space-y-4 min-h-[300px] overflow-hidden">
                {!generatedImgUrl ? (
                  <p className="text-xs text-slate-500 italic text-center">Descreva a imagem pretendida e clique em Gerar para criar imagens fotográficas em minutos.</p>
                ) : (
                  <div className="w-full space-y-4 text-center">
                    <h4 className="text-xs font-bold text-white text-left">Imagem Gerada:</h4>
                    <div 
                      className="w-full h-48 rounded-xl bg-cover bg-center border border-slate-800"
                      style={{ backgroundImage: `url('${generatedImgUrl}')` }}
                    />
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => handleApplyToWebsite("asset", generatedImgUrl)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white border border-slate-800"
                      >
                        Guardar na Galeria do Site
                      </button>
                      <button 
                        onClick={() => alert("Download triggered!")}
                        className="px-4 py-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark rounded-lg text-xs font-extrabold"
                      >
                        Descarregar Imagem
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. PWA CONVERTER SCREEN */}
          {activeModule === "apps" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Transição PWA & Aplicação Móvel</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transforme o seu website numa aplicação móvel progressiva (PWA). Os visitantes poderão instalar o seu site no telemóvel Android/iPhone com suporte a funcionamento offline e ícone na tela inicial.
                </p>
                
                {pwaStatus === "idle" && (
                  <button 
                    onClick={runPwaConversion}
                    className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Converter Website em Aplicação
                  </button>
                )}

                {pwaStatus === "converting" && (
                  <div className="space-y-2 text-center p-6 border border-slate-800 rounded-xl bg-slate-900/30">
                    <RefreshCw className="w-6 h-6 animate-spin text-brand-gold mx-auto" />
                    <p className="text-xs font-bold text-white">A compilar assets móveis (manifest.json, splashscreens, icons)...</p>
                  </div>
                )}

                {pwaStatus === "ready" && (
                  <div className="space-y-4 text-center p-6 border border-emerald-500/20 rounded-xl bg-emerald-500/5">
                    <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-white">Aplicação pronta para instalar!</p>
                      <p className="text-[10px] text-slate-400">Assets de PWA inseridos na estrutura de diretórios do site.</p>
                    </div>
                    <button 
                      onClick={() => alert("Assets package downloaded!")}
                      className="px-4 py-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark rounded-lg text-xs font-extrabold"
                    >
                      Descarregar Ficheiros (.zip)
                    </button>
                  </div>
                )}
              </div>

              {/* App Mock Preview */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <div className="w-48 h-80 rounded-[30px] border-4 border-slate-800 bg-slate-950 p-3 shadow-lg flex flex-col justify-between relative overflow-hidden">
                  <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
                  <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-brand-gold to-brand-gold-dark rounded-xl flex items-center justify-center font-bold text-brand-blue-dark text-lg shadow-md">
                      {logoName.slice(0,2).toUpperCase()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{logoName}</span>
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Instalado</span>
                  </div>
                  <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto" />
                </div>
                <span className="text-[10px] text-slate-500">Pré-visualização do ícone na tela inicial móvel</span>
              </div>
            </div>
          )}

          {/* 5. COPYWRITER / WRITING MODULE */}
          {activeModule === "escrita" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Gerar Textos de Secções</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Categoria de Texto</label>
                    <select 
                      value={copyType} 
                      onChange={(e) => setCopyType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    >
                      {["Página Inicial", "Sobre Nós", "Serviços", "FAQ", "Blog", "Emails"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={generateCopywrite}
                  disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Conteúdo com IA"}
                </button>
              </div>

              {/* Copywriting Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px] space-y-4">
                {!generatedCopy ? (
                  <p className="text-xs text-slate-500 italic text-center">Clique em Gerar para que o assistente redija textos profissionais, coerentes e prontos a publicar.</p>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white">Conteúdo Gerado:</h4>
                    <textarea 
                      rows={8}
                      value={generatedCopy}
                      onChange={(e) => setGeneratedCopy(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none leading-relaxed font-mono resize-none"
                    />
                    <button 
                      onClick={() => handleApplyToWebsite("copy", generatedCopy)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-slate-800 rounded-xl transition-all"
                    >
                      Aplicar ao Website
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. SEO SCREEN */}
          {activeModule === "seo" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Otimização de Motores de Busca</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gere e aplique de forma automatizada todos os metadados de rastreio, indexação e partilha nas redes sociais cruciais para que o seu site seja posicionado nas primeiras páginas do Google.
                </p>
                <button 
                  onClick={generateSEOData}
                  disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Tags SEO Automáticas"}
                </button>
              </div>

              {/* SEO Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px]">
                {!generatedSEO ? (
                  <p className="text-xs text-slate-500 italic text-center">Clique em Gerar para produzir metadados completos de Open Graph, Schema de JSON-LD e Robots.</p>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white">Metadados Gerados:</h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-500 block">META TITLE (Google Preview)</span>
                        <span className="text-white font-bold font-mono">{generatedSEO.title}</span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-500 block">META DESCRIPTION</span>
                        <span className="text-slate-300 font-mono leading-relaxed">{generatedSEO.description}</span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-500 block">KEYWORDS</span>
                        <span className="text-slate-400 font-mono">{generatedSEO.keywords}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApplyToWebsite("seo", generatedSEO)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-slate-800 rounded-xl transition-all"
                    >
                      Aplicar SEO ao Website
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. SOCIAL PLATFORMS */}
          {activeModule === "social" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Criar Publicações para Redes Sociais</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Plataforma</label>
                    <select 
                      value={socialPlatform} 
                      onChange={(e) => setSocialPlatform(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    >
                      {["Instagram", "LinkedIn", "Facebook", "X / Threads"].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={generateSocialPost}
                  disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Conteúdo Social"}
                </button>
              </div>

              {/* Social Output Preview */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px]">
                {!generatedSocial ? (
                  <p className="text-xs text-slate-500 italic text-center">Selecione a plataforma e crie descrições e hashtags prontas a copiar e publicar.</p>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white">Publicação Recomendada ({socialPlatform}):</h4>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {generatedSocial}
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedSocial);
                        alert("Copiado para a área de transferência!");
                      }}
                      className="w-full py-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs rounded-xl transition-all"
                    >
                      Copiar Texto
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. MARKETING CAMPAIGNS */}
          {activeModule === "marketing" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Slogans & Campanhas de Email</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Objetivo de Geração</label>
                    <select 
                      value={marketType} 
                      onChange={(e) => setMarketType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    >
                      {["Slogans Criativos", "Email de Lançamento"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={generateMarketingCampaigns}
                  disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Campanha com IA"}
                </button>
              </div>

              {/* Marketing Campaigns Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px]">
                {generatedMarket.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center">Clique em Gerar para obter ideias de slogans criativos ou redações prontas de e-mail marketing.</p>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white">Sugestões Criadas:</h4>
                    <div className="space-y-2">
                      {generatedMarket.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 whitespace-pre-line font-medium">
                          {item}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedMarket.join("\n\n"));
                        alert("Copiado com sucesso!");
                      }}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-slate-800 rounded-xl"
                    >
                      Copiar Tudo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. LEGAL DOCUMENTS */}
          {activeModule === "legal" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Documentos Legais Obrigatórios</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tipo de Documento</label>
                    <select 
                      value={docType} 
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    >
                      {["Política de Privacidade", "Termos e Condições", "Cookies & Consentimento"].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={generateLegalDocuments}
                  disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Documento Legal"}
                </button>
              </div>

              {/* Legal Output Screen */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px]">
                {!generatedDoc ? (
                  <p className="text-xs text-slate-500 italic text-center">Gere as políticas regulamentares e adeque o seu negócio ao RGPD europeu.</p>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white">Previsão do Documento:</h4>
                    <textarea 
                      rows={8}
                      value={generatedDoc}
                      onChange={(e) => setGeneratedDoc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none leading-relaxed font-mono resize-none"
                    />
                    <button 
                      onClick={() => alert("Document saved to your files!")}
                      className="w-full py-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs rounded-xl transition-all"
                    >
                      Descarregar Documento (.txt)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 10. VIDEO SCRIPT GENERATOR */}
          {activeModule === "videos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Gerar Guião de Vídeo</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tema / Ideia Principal</label>
                    <textarea 
                      rows={3}
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Ex: Um vídeo curto de 30 segundos a divulgar as promoções da nossa clínica de estética"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none resize-none" 
                    />
                  </div>
                </div>
                <button 
                  onClick={generateVideoScriptDraft}
                  disabled={generating || !videoPrompt}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Guião de Vídeo com IA"}
                </button>
              </div>

              {/* Video Script Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px]">
                {!generatedVideoScript ? (
                  <p className="text-xs text-slate-500 italic text-center">Gere a estrutura de áudio, falas e referências visuais para Reels e campanhas de vídeo.</p>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white">Estrutura do Guião:</h4>
                    <textarea 
                      rows={8}
                      value={generatedVideoScript}
                      onChange={(e) => setGeneratedVideoScript(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none leading-relaxed font-mono resize-none"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedVideoScript);
                        alert("Guião copiado para transferência!");
                      }}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-slate-800 rounded-xl"
                    >
                      Copiar Guião
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 11. PRODUCT DESCRIPTIONS */}
          {activeModule === "produtos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Ficha de Produto e E-Commerce</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nome do Produto</label>
                    <input 
                      type="text" 
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="Ex: Creme Hidratante Gold"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Breve Descrição do Produto</label>
                    <textarea 
                      rows={3}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Ex: creme de hidratação profunda com micro-partículas de ouro e aloe vera"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none resize-none" 
                    />
                  </div>
                </div>
                <button 
                  onClick={generateProductSpecs}
                  disabled={generating || !prodName}
                  className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Gerar Ficha de Produto"}
                </button>
              </div>

              {/* Product Spec Output */}
              <div className="rounded-xl border border-slate-800 bg-[#030712]/30 p-6 flex flex-col justify-center min-h-[300px]">
                {!generatedProd ? (
                  <p className="text-xs text-slate-500 italic text-center">Escreva os dados básicos do seu produto para obter redações de conversão completas para a sua loja.</p>
                ) : (
                  <div className="space-y-4 text-xs">
                    <h4 className="text-xs font-bold text-white">Ficha de Produto Gerada:</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-550 block">TÍTULO COMERCIAL</span>
                        <strong className="text-white block mt-1">{generatedProd.title}</strong>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-550 block">DESCRIÇÃO LONGA</span>
                        <p className="text-slate-300 leading-relaxed mt-1">{generatedProd.descLong}</p>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-550 block">BENEFÍCIOS PRINCIPAIS</span>
                        <ul className="list-disc pl-4 text-slate-350 space-y-0.5">
                          {generatedProd.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </motion.div>
      )}

    </div>
  );
}
