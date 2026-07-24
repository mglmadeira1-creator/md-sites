"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Sparkles, 
  Send,
  Smartphone, 
  Tablet, 
  Monitor, 
  Globe, 
  Check, 
  RefreshCw,
  Rocket,
  Edit2,
  Cpu,
  ChevronRight,
  Play,
  ArrowRight,
  MessageSquare,
  PanelLeft,
  X,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import canvasConfetti from "canvas-confetti";

interface Message {
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  statusLogs?: string[];
  suggestions?: string[];
}

export default function ConversationalCopilotBuilder() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // States representing the dynamic website
  const [brandName, setBrandName] = useState("A Minha Marca");
  const [category, setCategory] = useState("Serviços Profissionais");
  const [description, setDescription] = useState("Descreve o teu negócio e veja a IA criar os conteúdos.");
  const [palette, setPalette] = useState("blue-gold");
  const [features, setFeatures] = useState<string[]>(["servicos", "contactos"]);
  
  // Design System States (Intelligent Design)
  const [heroVariant, setHeroVariant] = useState("modern"); // minimalist, modern, premium, corporate, creative, restaurant
  const [headerVariant, setHeaderVariant] = useState("sticky"); // transparent, classic, sticky, centralized
  const [cardVariant, setCardVariant] = useState("glass"); // minimalist, elevated, glass, premium
  const [borderRadius, setBorderRadius] = useState("xl"); // none, md, xl, full
  const [fontFamily, setFontFamily] = useState("sans"); // sans, mono, display, serif
  const [shadowStyle, setShadowStyle] = useState("glow"); // none, sm, lg, glow

  const [isCompleted, setIsCompleted] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome Message from AI Copilot
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Olá! Sou o AI Copilot da MD Sites. 🤖\n\nSou o teu designer de marca e programador pessoal. Descreve o website que imaginas (ex: 'Quero um site estilo Apple', 'Cria um site minimalista preto e dourado para advocacia' ou 'Cria um site divertido e colorido para crianças').\n\nEu crio um Design System único com layouts e componentes adaptados!",
        timestamp: new Date(),
        suggestions: [
          "Cria um website estilo Apple.",
          "Cria um site de carros elétricos estilo Tesla.",
          "Quero um site inspirado no Spotify para um estúdio de som.",
          "Faz um website infantil colorido para ATL."
        ]
      }
    ]);
  }, []);

  // Pre-load edit parameters if edit id is in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const editParam = params.get("edit");
      if (editParam) {
        setEditId(editParam);
        const fetchWebsite = async () => {
          const { data, error } = await supabase
            .from("websites")
            .select("*")
            .eq("id", editParam)
            .single();
          if (data && !error) {
            setBrandName(data.name);
            setCategory(data.category);
            setDescription(data.description || "");
            setFeatures(data.features);
            setIsCompleted(true);

            // Deserialize combined layout variables from the palette column
            const parts = data.palette.split(":");
            if (parts.length > 1) {
              setPalette(parts[0]);
              setHeroVariant(parts[1] || "modern");
              setCardVariant(parts[2] || "glass");
              setBorderRadius(parts[3] || "xl");
              setFontFamily(parts[4] || "sans");
              if (parts[5]) setShadowStyle(parts[5]);
            } else {
              setPalette(data.palette);
            }

            setMessages(prev => [
              ...prev,
              {
                sender: "ai",
                text: `Carreguei com sucesso a identidade de **${data.name}**. Que modificações de design ou novas secções queres fazer agora?`,
                timestamp: new Date(),
                suggestions: [
                  "Mudar para estilo minimalista",
                  "Mudar para cores da Tesla",
                  "Adicionar secção de FAQ"
                ]
              }
            ]);
          }
        };
        fetchWebsite();
      }
    }
  }, []);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Intelligent Design Prompt Parser
  const interpretUserPrompt = (prompt: string) => {
    const p = prompt.toLowerCase();
    
    let detectedCat = category;
    let detectedDesc = description;
    let detectedName = brandName;
    let detectedPalette = palette;
    let detectedFeatures = [...features];

    // Design System Default fallbacks
    let dHero = heroVariant;
    let dHeader = headerVariant;
    let dCard = cardVariant;
    let dBorder = borderRadius;
    let dFont = fontFamily;
    let dShadow = shadowStyle;

    // 1. STYLE INTERPRETATIONS (Apple, Tesla, Spotify, Infantil, Luxo/Premium, etc.)
    if (p.includes("apple") || p.includes("minimalista")) {
      detectedPalette = "mono-light";
      dHero = "minimalist";
      dHeader = "transparent";
      dCard = "minimalist";
      dBorder = "xl";
      dFont = "sans";
      dShadow = "none";
      detectedDesc = "Desenho minimalista focado na simplicidade, elegância e espaço em branco.";
    } 
    else if (p.includes("tesla") || p.includes("futurista")) {
      detectedPalette = "indigo-purple";
      dHero = "premium";
      dHeader = "sticky";
      dCard = "premium";
      dBorder = "md";
      dFont = "display";
      dShadow = "glow";
      detectedDesc = "Estilo futurista e imersivo com imagens em escala total e tipografia impactante.";
    }
    else if (p.includes("spotify") || p.includes("divertido") && p.includes("escuro")) {
      detectedPalette = "indigo-purple";
      dHero = "creative";
      dHeader = "sticky";
      dCard = "glass";
      dBorder = "full";
      dFont = "mono";
      dShadow = "glow";
      detectedDesc = "Inspirado em gradientes, cores vibrantes no escuro e cartões destacados.";
    }
    else if (p.includes("infantil") || p.includes("crianças") || p.includes("colorido")) {
      detectedPalette = "emerald-dark"; // Custom color handling below
      dHero = "creative";
      dHeader = "classic";
      dCard = "elevated";
      dBorder = "full";
      dFont = "display";
      dShadow = "lg";
      detectedDesc = "Ambiente alegre, acolhedor e visualmente dinâmico desenhado para crianças.";
    }
    else if (p.includes("luxo") || p.includes("premium") || p.includes("elegante")) {
      detectedPalette = "blue-gold";
      dHero = "premium";
      dHeader = "centralized";
      dCard = "premium";
      dBorder = "none";
      dFont = "serif";
      dShadow = "lg";
      detectedDesc = "Estética corporativa refinada, tons sóbrios e detalhes dourados de alta autoridade.";
    }

    // 2. DETECT CATEGORY / SECTOR
    if (p.includes("restaurante") || p.includes("pizzaria") || p.includes("italiano") || p.includes("comida") || p.includes("cafe")) {
      detectedCat = "Restaurante & Gastronomia";
      detectedDesc = "Uma viagem de sabores concebida com produtos frescos da época.";
      dHero = "restaurant";
      dCard = "elevated";
      if (brandName === "A Minha Marca" || brandName === "A Minha Empresa") {
        detectedName = "Forno d'Ouro";
      }
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    } 
    else if (p.includes("tecnologia") || p.includes("saas") || p.includes("consultor") || p.includes("software")) {
      detectedCat = "Tecnologia & SaaS";
      detectedDesc = "Engenharia de software avançada para otimizar os fluxos da sua empresa.";
      if (brandName === "A Minha Marca" || brandName === "A Minha Empresa") {
        detectedName = "Cyber Core Systems";
      }
    }
    else if (p.includes("clinica") || p.includes("saude") || p.includes("estetica") || p.includes("spa")) {
      detectedCat = "Saúde & Estética";
      detectedDesc = "Cuidado personalizado de saúde e bem-estar dermatológico.";
      if (brandName === "A Minha Marca" || brandName === "A Minha Empresa") {
        detectedName = "DermaGlow Clinic";
      }
    }

    // 3. BRAND NAME EXTRACTOR
    const nameMatch = prompt.match(/chamad[oa]\s+["']?([^"']+)["']?/i) || prompt.match(/nome\s+["']?([^"']+)["']?/i);
    if (nameMatch && nameMatch[1]) {
      detectedName = nameMatch[1].trim();
    }

    // 4. REACTIVE DESIGN ADJUSTMENTS
    if (p.includes("muda") || p.includes("troca") || p.includes("mete") || p.includes("altera")) {
      if (p.includes("azul") || p.includes("roxo")) detectedPalette = "indigo-purple";
      if (p.includes("verde") || p.includes("esmeralda")) detectedPalette = "emerald-dark";
      if (p.includes("dourado") || p.includes("preto")) detectedPalette = "blue-gold";
      if (p.includes("branco") || p.includes("claro")) detectedPalette = "mono-light";

      if (p.includes("serif") || p.includes("serifa") || p.includes("classica")) dFont = "serif";
      if (p.includes("mono") || p.includes("codigo")) dFont = "mono";
      if (p.includes("arredondado") || p.includes("redondo")) dBorder = "full";
      if (p.includes("quadrado") || p.includes("reto")) dBorder = "none";
    }

    // 5. WIDGET FEATURES
    if (p.includes("whatsapp")) {
      if (!detectedFeatures.includes("whatsapp")) detectedFeatures.push("whatsapp");
    }
    if (p.includes("galeria")) {
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    }
    if (p.includes("faq")) {
      if (!detectedFeatures.includes("faq")) detectedFeatures.push("faq");
    }
    if (p.includes("testemunhos") || p.includes("depoimentos")) {
      if (!detectedFeatures.includes("depoimentos")) detectedFeatures.push("depoimentos");
    }

    return {
      name: detectedName,
      category: detectedCat,
      description: detectedDesc,
      palette: detectedPalette,
      features: detectedFeatures,
      hero: dHero,
      header: dHeader,
      card: dCard,
      border: dBorder,
      font: dFont,
      shadow: dShadow
    };
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text, timestamp: new Date() }]);
    setInputValue("");
    setAiTyping(true);

    const thoughts = [
      "❯ Analisando briefing criativo...",
      "❯ Ajustando paleta e tipografia...",
      "❯ Selecionando componentes no Design System...",
      "❯ Atualizando grid e layout dinâmico..."
    ];

    let tIdx = 0;
    const thoughtInterval = setInterval(() => {
      if (tIdx < thoughts.length) {
        setActiveLogs(prev => [...prev, thoughts[tIdx]]);
        tIdx++;
      } else {
        clearInterval(thoughtInterval);
      }
    }, 250);

    setTimeout(async () => {
      const design = interpretUserPrompt(text);
      
      setBrandName(design.name);
      setCategory(design.category);
      setDescription(design.description);
      setPalette(design.palette);
      setFeatures(design.features);

      // Apply Design system layout options
      setHeroVariant(design.hero);
      setHeaderVariant(design.header);
      setCardVariant(design.card);
      setBorderRadius(design.border);
      setFontFamily(design.font);
      setShadowStyle(design.shadow);
      
      setIsCompleted(true);

      // Serialize Design System variables in the DB palette string field
      const serializedPalette = `${design.palette}:${design.hero}:${design.card}:${design.border}:${design.font}:${design.shadow}`;

      const slug = design.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const randomHash = Math.random().toString(36).substring(2, 6);
      const websiteUrl = editId 
        ? `${slug}.mdsites.app`
        : `${slug || "site"}-${randomHash}.mdsites.app`;

      const payload = {
        name: design.name,
        category: design.category,
        description: design.description,
        palette: serializedPalette,
        features: design.features,
        url: websiteUrl,
        status: "Publicado"
      };

      if (editId) {
        await supabase.from("websites").update(payload).eq("id", editId);
      } else {
        await supabase.from("websites").insert([payload]);
      }

      const nextSuggestions = [
        "Mudar para estilo Apple minimalista",
        "Mudar para estilo Tesla futurista",
        "Tornar as bordas quadradas",
        "Adicionar secção de Testemunhos"
      ];

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `Atualizei o website com sucesso no Design System! Efetuei as seguintes alterações:\n\n✓ Layout de Hero: **${design.hero}**\n✓ Fontes: **${design.font}**\n✓ Cantos e Bordas: **${design.border}**\n✓ Sombra / Brilho: **${design.shadow}**\n✓ Estilo de Cards: **${design.card}**\n✓ Paleta: **${design.palette}**\n\nQue refinamento visual gostaria de fazer a seguir?`,
          timestamp: new Date(),
          suggestions: nextSuggestions
        }
      ]);

      canvasConfetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      setAiTyping(false);
      setActiveLogs([]);
    }, 1500);
  };

  const handleSurpriseMe = () => {
    const creativeIdeas = [
      "Cria um website estilo Apple para arquitetura chamado Minimal Space.",
      "Quero um site estilo Tesla futurista escuro para uma marca de baterias solar.",
      "Cria um site infantil super colorido chamado Jardim da Fantasia.",
      "Faz um site estilo Spotify para uma produtora de música chamada Wave Beats."
    ];
    const randomPrompt = creativeIdeas[Math.floor(Math.random() * creativeIdeas.length)];
    handleSend(randomPrompt);
  };

  const getThemeClasses = () => {
    switch (palette) {
      case "emerald-dark":
        return {
          bg: "bg-[#022c22]",
          card: "bg-[#064e3b]/80 border-[#10b981]/20",
          textAccent: "text-[#10b981]",
          btnAccent: "bg-[#10b981] hover:bg-[#059669] text-white",
          btnOutline: "border-[#10b981]/30 hover:bg-[#10b981]/10 text-white"
        };
      case "indigo-purple":
        return {
          bg: "bg-[#0f172a]",
          card: "bg-[#1e1b4b]/80 border-[#6366f1]/20",
          textAccent: "text-[#6366f1]",
          btnAccent: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
          btnOutline: "border-[#6366f1]/30 hover:bg-[#6366f1]/10 text-white"
        };
      case "mono-light":
        return {
          bg: "bg-slate-50",
          card: "bg-white border-slate-200 shadow-sm",
          textAccent: "text-slate-800",
          btnAccent: "bg-slate-900 hover:bg-slate-800 text-white",
          btnOutline: "border-slate-300 hover:bg-slate-100 text-slate-900"
        };
      case "blue-gold":
      default:
        return {
          bg: "bg-[#0a0f1d]",
          card: "bg-[#111827]/80 border-[#d4af37]/20",
          textAccent: "text-[#d4af37]",
          btnAccent: "bg-gradient-to-r from-[#d4af37] to-[#c5a059] hover:shadow-lg text-slate-900 font-bold",
          btnOutline: "border-[#d4af37]/30 hover:bg-[#d4af37]/10 text-white"
        };
    }
  };

  // Resolve visual classes from variables
  const previewTheme = getThemeClasses();

  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case "none": return "rounded-none";
      case "md": return "rounded-md";
      case "full": return "rounded-full";
      case "xl":
      default:
        return "rounded-2xl";
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case "mono": return "font-mono";
      case "serif": return "font-serif";
      case "display": return "font-display";
      case "sans":
      default:
        return "font-sans";
    }
  };

  const getShadowClass = () => {
    switch (shadowStyle) {
      case "none": return "shadow-none border-white/5";
      case "sm": return "shadow-sm border-white/5";
      case "lg": return "shadow-2xl border-white/10";
      case "glow":
      default:
        return palette === "emerald-dark" 
          ? "shadow-[0_0_22px_rgba(16,185,129,0.15)] border-emerald-500/20"
          : palette === "indigo-purple"
          ? "shadow-[0_0_22px_rgba(99,102,241,0.18)] border-indigo-500/20"
          : "shadow-[0_0_22px_rgba(212,175,55,0.16)] border-brand-gold/20";
    }
  };

  const getGeneratedContent = () => {
    let heroTitle = `Soluções inteligentes para ${brandName}`;
    let heroSubtitle = description;
    let services = [
      { name: "Consultoria Premium", desc: "Aconselhamento estratégico personalizado para otimizar os seus resultados." },
      { name: "Gestão Integrada", desc: "Tratamos dos processos complexos para que se foque no que realmente importa." },
      { name: "Suporte Dedicado", desc: "A nossa equipa técnica está sempre disponível para assegurar a máxima estabilidade." }
    ];

    if (category.toLowerCase().includes("restaurante") || category.toLowerCase().includes("gastronomia")) {
      heroTitle = `Bem-vindo ao ${brandName}`;
      heroSubtitle = `Uma experiência gastronómica inesquecível de sabores autênticos. ${description}`;
      services = [
        { name: "Menu de Degustação", desc: "Pratos de autor confecionados com ingredientes frescos e locais." },
        { name: "Eventos Privados", desc: "Espaço sofisticado para celebrar momentos marcantes com requinte." },
        { name: "Serviço de Reservas", desc: "Garanta a sua mesa com facilidade e desfrute de um atendimento exclusivo." }
      ];
    } else if (category.toLowerCase().includes("tecnologia") || category.toLowerCase().includes("saas")) {
      heroTitle = `Acelere o seu negócio com ${brandName}`;
      heroSubtitle = `A tecnologia que simplifica o seu fluxo de trabalho de forma automatizada. ${description}`;
      services = [
        { name: "Automação Avançada", desc: "Elimine tarefas manuais repetitivas e ganhe horas de produtividade diária." },
        { name: "Painel de Métricas", desc: "Dados consolidados em tempo real para tomada de decisões estratégicas." },
        { name: "Segurança de Dados", desc: "Criptografia avançada de ponta a ponta para proteger a sua informação." }
      ];
    } else if (category.toLowerCase().includes("saúde") || category.toLowerCase().includes("estética")) {
      heroTitle = `Cuide de si no ${brandName}`;
      heroSubtitle = `Tratamentos e cuidados de excelência focados no seu bem-estar. ${description}`;
      services = [
        { name: "Tratamentos Especializados", desc: "Procedimentos modernos realizados por profissionais experientes." },
        { name: "Consultas de Avaliação", desc: "Diagnóstico completo e plano de tratamento ajustado às suas necessidades." },
        { name: "Produtos Premium", desc: "Utilização exclusiva de marcas conceituadas de elevada qualidade dermatológica." }
      ];
    }

    return { heroTitle, heroSubtitle, services };
  };

  const previewContent = getGeneratedContent();
  const isLight = palette === "mono-light";

  return (
    <div className="relative w-full h-screen bg-[#030712] overflow-hidden flex flex-col justify-between text-slate-100">
      
      {/* Background image base */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20 opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/fundo-paginas.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/95 via-[#030712]/90 to-[#030712] -z-10" />

      {/* Header bar */}
      <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/60 backdrop-blur-md relative z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all py-1.5 px-3 rounded-lg bg-white/5 border border-slate-800"
          >
            Sair do Copilot
          </button>
          <div className="w-[1px] h-4 bg-slate-800" />
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">AI Designer Studio v3.0</span>
        </div>
        <Image
          src="/logonovo.png"
          alt="MD Sites Logo"
          width={120}
          height={34}
          className="h-6 w-auto object-contain"
        />
      </header>

      {/* Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: AI Copilot Chat panel */}
        <div className="w-full lg:w-[480px] border-r border-slate-800/80 flex flex-col bg-slate-950/40 backdrop-blur-md relative z-20 flex-shrink-0">
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              AI Designer de Marca
            </span>
            <button 
              onClick={handleSurpriseMe}
              className="text-[10px] font-bold text-brand-gold hover:text-white bg-brand-gold/15 hover:bg-brand-gold/25 px-2.5 py-1 rounded-md transition-all flex items-center gap-1"
            >
              ✨ Surpreende-me
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-semibold rounded-tr-none" 
                    : "bg-slate-900 border border-slate-800 text-slate-250 rounded-tl-none space-y-3"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-850">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="w-full text-left text-[10px] font-bold text-brand-gold hover:text-white bg-slate-950/80 hover:bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 transition-colors"
                        >
                          ➔ {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {aiTyping && (
              <div className="flex flex-col items-start space-y-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-350 space-y-2.5 rounded-tl-none w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                    <span className="font-bold text-white">O Copilot está a desenhar...</span>
                  </div>
                  {activeLogs.length > 0 && (
                    <div className="space-y-1 font-mono text-[10px] text-[#10b981] border-t border-slate-850 pt-2">
                      {activeLogs.map((log, lIdx) => (
                        <div key={lIdx}>{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat input area */}
          <div className="p-4 border-t border-slate-800/85 bg-slate-950/60">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ex: 'Quero um site estilo Apple minimalista'"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/30"
              />
              <button
                type="submit"
                disabled={aiTyping || !inputValue.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark transition-all disabled:opacity-40 flex items-center justify-center"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Real-time Live Preview Browser */}
        <div className="hidden lg:flex flex-1 flex-col bg-slate-950/30 overflow-hidden relative">
          
          {/* Browser Address and Viewport settings */}
          <div className="h-12 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <div className="w-[1px] h-3.5 bg-slate-800 mx-2" />
              <span className="text-[10px] text-slate-500 font-mono select-none">
                URL: https://{brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "site"}.mdsites.app
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded-lg transition-colors ${previewMode === "desktop" ? "bg-white/10 text-brand-gold" : "text-slate-400 hover:text-white"}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode("tablet")}
                className={`p-1.5 rounded-lg transition-colors ${previewMode === "tablet" ? "bg-white/10 text-brand-gold" : "text-slate-400 hover:text-white"}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded-lg transition-colors ${previewMode === "mobile" ? "bg-white/10 text-brand-gold" : "text-slate-400 hover:text-white"}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser dynamic preview screen */}
          <div className="flex-1 overflow-hidden p-6 flex justify-center items-start bg-slate-900/10">
            <div className={`h-full border border-slate-800 bg-black/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[680px]" : "w-[360px]"
            }`}>
              
              {/* Dynamic Live website page */}
              <div className={`h-full overflow-y-auto relative transition-all duration-500 ${previewTheme.bg} ${
                isLight ? "text-slate-850" : "text-slate-350"
              } ${getFontFamilyClass()}`}>
                
                {/* DYNAMIC HEADER VARIANT */}
                {headerVariant === "centralized" ? (
                  <div className={`flex flex-col items-center justify-center p-6 gap-3 border-b ${
                    isLight ? "border-slate-200/60 bg-white/70" : "border-white/5 bg-[#030712]/30"
                  }`}>
                    <div className={`font-bold text-xl flex items-center gap-1.5 font-display select-none ${isLight ? "text-slate-900" : "text-white"}`}>
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
                      {brandName}
                    </div>
                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-wider font-semibold select-none">
                      <span className="hover:text-white cursor-pointer transition-colors">Início</span>
                      {features.includes("servicos") && <span className="hover:text-white cursor-pointer transition-colors">Serviços</span>}
                      {features.includes("galeria") && <span className="hover:text-white cursor-pointer transition-colors">Galeria</span>}
                      {features.includes("depoimentos") && <span className="hover:text-white cursor-pointer transition-colors">Clientes</span>}
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-center justify-between p-6 border-b ${
                    headerVariant === "sticky" ? "sticky top-0 z-45 backdrop-blur-md" : ""
                  } ${isLight ? "border-slate-200/60 bg-white/70" : "border-white/5 bg-[#030712]/30"}`}>
                    <div className={`font-bold text-lg flex items-center gap-1.5 font-display select-none ${isLight ? "text-slate-900" : "text-white"}`}>
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
                      {brandName}
                    </div>
                    <div className="flex items-center gap-6 text-xs font-semibold select-none">
                      <span className="hover:text-white cursor-pointer transition-colors">Início</span>
                      {features.includes("servicos") && <span className="hover:text-white cursor-pointer transition-colors">Serviços</span>}
                      {features.includes("galeria") && <span className="hover:text-white cursor-pointer transition-colors">Galeria</span>}
                      {features.includes("depoimentos") && <span className="hover:text-white cursor-pointer transition-colors">Clientes</span>}
                    </div>
                  </div>
                )}

                {/* DYNAMIC HERO VARIANT */}
                {heroVariant === "minimalist" ? (
                  <div className="py-28 px-8 text-center space-y-4 max-w-xl mx-auto">
                    <h1 className={`text-3xl font-light tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                      {previewContent.heroTitle}
                    </h1>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                      {previewContent.heroSubtitle}
                    </p>
                    <div className="pt-4">
                      <button className="text-xs font-semibold hover:underline flex items-center gap-1 mx-auto text-brand-gold">
                        Explorar portfólio <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : heroVariant === "premium" ? (
                  <div className="py-24 px-8 text-center space-y-8 max-w-3xl mx-auto">
                    <div className={`inline-flex items-center gap-1 py-1 px-3 rounded-full text-[9px] uppercase tracking-widest font-extrabold ${
                      isLight ? "bg-slate-200/80 text-slate-800" : "bg-white/5 border border-white/10 text-white"
                    }`}>
                      <Sparkles className="w-3 h-3 text-brand-gold" />
                      {category}
                    </div>
                    <h1 className={`text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight uppercase ${isLight ? "text-slate-900" : "text-white"}`}>
                      {previewContent.heroTitle}
                    </h1>
                    <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-400">
                      {previewContent.heroSubtitle}
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <button className={`px-6 py-3 ${getBorderRadiusClass()} text-xs font-bold transition-transform hover:scale-[1.02] shadow-lg ${previewTheme.btnAccent}`}>
                        Começar Agora
                      </button>
                      <button className={`px-6 py-3 ${getBorderRadiusClass()} text-xs font-bold border transition-colors ${previewTheme.btnOutline}`}>
                        Falar Connosco
                      </button>
                    </div>
                  </div>
                ) : heroVariant === "restaurant" ? (
                  <div className="py-20 px-8 text-left space-y-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <h1 className={`text-3xl sm:text-4xl font-serif font-extrabold leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                        {previewContent.heroTitle}
                      </h1>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {previewContent.heroSubtitle}
                      </p>
                      <button className={`px-6 py-3 ${getBorderRadiusClass()} text-xs font-bold ${previewTheme.btnAccent}`}>
                        Fazer Reserva Online
                      </button>
                    </div>
                    <div className={`aspect-square rounded-2xl flex items-center justify-center border text-[11px] font-semibold italic ${previewTheme.card} ${getShadowClass()}`}>
                      Prato de Assinatura - Foto
                    </div>
                  </div>
                ) : (
                  // Default/Modern hero variant
                  <div className="py-20 px-8 text-center space-y-6 max-w-2xl mx-auto">
                    <div className={`inline-flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-bold ${
                      isLight ? "bg-slate-200/80 text-slate-800" : "bg-white/5 border border-white/10 text-white"
                    }`}>
                      <Sparkles className="w-3 h-3 text-brand-gold" />
                      {category}
                    </div>
                    <h1 className={`text-3xl font-display font-extrabold leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                      {previewContent.heroTitle}
                    </h1>
                    <p className="text-xs leading-relaxed max-w-md mx-auto">
                      {previewContent.heroSubtitle}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button className={`px-5 py-2.5 ${getBorderRadiusClass()} text-xs font-bold ${previewTheme.btnAccent}`}>
                        Nossos Serviços
                      </button>
                      <button className={`px-5 py-2.5 ${getBorderRadiusClass()} text-xs font-bold border ${previewTheme.btnOutline}`}>
                        Contacto
                      </button>
                    </div>
                  </div>
                )}

                {/* SERVICES SECTION */}
                {features.includes("servicos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-1.5">
                      <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Nossos Serviços</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Soluções feitas para si</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {previewContent.services.map((srv, idx) => (
                        <div 
                          key={idx} 
                          className={`p-5 flex flex-col justify-between h-[150px] transition-all ${getBorderRadiusClass()} ${
                            cardVariant === "minimalist" ? "border-slate-800 bg-transparent text-left" :
                            cardVariant === "elevated" ? "bg-slate-900 border border-slate-800 shadow-md" :
                            previewTheme.card
                          } ${getShadowClass()}`}
                        >
                          <div className="space-y-1.5">
                            <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{srv.name}</h4>
                            <p className="text-[10px] text-slate-450 leading-relaxed">{srv.desc}</p>
                          </div>
                          <span className={`text-[10px] font-bold ${previewTheme.textAccent}`}>➔ Saber mais</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GALLERY SECTION */}
                {features.includes("galeria") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-1.5">
                      <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Portfólio / Galeria</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nosso trabalho recente</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`aspect-video flex items-center justify-center text-[10px] border ${getBorderRadiusClass()} ${previewTheme.card} ${getShadowClass()}`}>
                          Imagem {i}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TESTIMONIALS SECTION */}
                {features.includes("depoimentos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-1.5">
                      <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Depoimentos</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">O que dizem os clientes</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "Maria Silva", text: "Excelente atendimento e dedicação total." },
                        { name: "João Santos", text: "O website ficou excelente e super rápido!" }
                      ].map((dep, idx) => (
                        <div key={idx} className={`p-4 border space-y-2.5 ${getBorderRadiusClass()} ${previewTheme.card} ${getShadowClass()}`}>
                          <div className="flex text-amber-400 gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />)}
                          </div>
                          <p className="text-[10px] text-slate-400 italic">"{dep.text}"</p>
                          <span className={`text-[10px] font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>{dep.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ SECTION */}
                {features.includes("faq") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-3xl mx-auto space-y-6">
                    <h2 className="text-xl font-bold text-white text-center mb-6">Perguntas Frequentes</h2>
                    <div className="space-y-3">
                      {[
                        { q: "Quais são os vossos prazos de entrega?", a: "Dependendo da dimensão do projeto, tipicamente realizamos a entrega final num prazo de 3 a 7 dias úteis." },
                        { q: "Posso solicitar alterações após a publicação?", a: "Sim, suportamos facilidade de alteração e modificações continuas a qualquer momento." }
                      ].map((faq, fi) => (
                        <div key={fi} className={`p-4 border ${getBorderRadiusClass()} ${previewTheme.card} ${getShadowClass()}`}>
                          <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"} mb-1.5`}>{faq.q}</h4>
                          <p className="text-[10px] text-slate-450 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CONTACT SECTION */}
                {features.includes("contactos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-md mx-auto space-y-6">
                    <h2 className={`text-xl font-bold text-center ${isLight ? "text-slate-900" : "text-white"}`}>Contacte-nos</h2>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Nome"
                        className={`w-full bg-black/10 border p-2.5 text-xs focus:outline-none ${getBorderRadiusClass()} ${
                          isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
                        }`}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className={`w-full bg-black/10 border p-2.5 text-xs focus:outline-none ${getBorderRadiusClass()} ${
                          isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
                        }`}
                      />
                      <textarea
                        rows={3}
                        placeholder="Mensagem..."
                        className={`w-full bg-black/10 border p-2.5 text-xs focus:outline-none resize-none ${getBorderRadiusClass()} ${
                          isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
                        }`}
                      />
                      <button className={`w-full py-2.5 text-xs font-bold ${getBorderRadiusClass()} ${previewTheme.btnAccent}`}>
                        Enviar Mensagem
                      </button>
                    </form>
                  </div>
                )}

                {/* WhatsApp Widget Render */}
                {features.includes("whatsapp") && (
                  <div className="absolute bottom-6 right-6 z-25 flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl cursor-pointer hover:scale-105 transition-all">
                    <MessageSquare className="w-6 h-6 fill-white" />
                  </div>
                )}

                {/* Footer */}
                <div className={`p-8 border-t text-center text-[10px] text-slate-500 select-none ${
                  isLight ? "border-slate-200/60" : "border-white/5"
                }`} suppressHydrationWarning>
                  &copy; {new Date().getFullYear()} {brandName}. Desenvolvido com IA da MD Sites.
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
