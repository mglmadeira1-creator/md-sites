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
  Star,
  Shuffle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import canvasConfetti from "canvas-confetti";

interface Message {
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function ConversationalCopilotBuilder() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // Core brand content
  const [brandName, setBrandName] = useState("A Minha Marca");
  const [category, setCategory] = useState("Serviços Profissionais");
  const [description, setDescription] = useState("Descreve o teu negócio e veja a IA criar os conteúdos.");
  const [features, setFeatures] = useState<string[]>(["servicos", "contactos"]);

  // Designer System states (Copilot v4.0+ Architectural Layout Selector)
  const [brandStyle, setBrandStyle] = useState("default"); // apple, tesla, stripe, notion, linear, vercel, airbnb, default
  const [palette, setPalette] = useState("blue-gold"); // blue-gold, indigo-purple, emerald-dark, mono-light, red
  const [borderRadius, setBorderRadius] = useState("xl"); // none, md, xl, full
  const [fontFamily, setFontFamily] = useState("sans"); // sans, mono, display, serif
  const [shadowStyle, setShadowStyle] = useState("glow"); // none, sm, lg, glow
  const [spacingScale, setSpacingScale] = useState("normal"); // compact, normal, wide

  const [isCompleted, setIsCompleted] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Welcome
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Olá! Sou o AI Copilot da MD Sites. 🤖\n\nSou o teu parceiro criativo, designer UI/UX e programador. Descreve simplesmente o website que pretendes de forma livre e natural.\n\nExperimenta pedir estilos de marcas icónicas ou cores específicas:\n• *'Quero um site estilo Stripe moderno para SaaS'*\n• *'Cria um site vermelho e preto super moderno'*\n• *'Faz um layout futurista escuro estilo Linear'*\n• *'Quero um restaurante italiano estilo Apple'*\n\nEu decido a estrutura, paleta, componentes e integrações ideais para ti!",
        timestamp: new Date()
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

            // Deserialize complex design styles from palette column
            const parts = data.palette.split(":");
            if (parts.length > 1) {
              setPalette(parts[0]);
              setBrandStyle(parts[1] || "default");
              setBorderRadius(parts[2] || "xl");
              setFontFamily(parts[3] || "sans");
              setShadowStyle(parts[4] || "glow");
              setSpacingScale(parts[5] || "normal");
            } else {
              setPalette(data.palette);
            }

            setMessages(prev => [
              ...prev,
              {
                sender: "ai",
                text: `Carreguei com sucesso o website **${data.name}**. Que modificações de design ou novas secções gostarias que eu aplicasse no Design System hoje?`,
                timestamp: new Date()
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

  // AI Prompt Parser (Architectural Layout Presets)
  const interpretUserPrompt = (prompt: string) => {
    const p = prompt.toLowerCase();
    
    let detectedCat = category;
    let detectedDesc = description;
    let detectedName = brandName;
    let detectedPalette = palette;
    let detectedFeatures = [...features];

    // Design layout defaults
    let dStyle = brandStyle;
    let dBorder = borderRadius;
    let dFont = fontFamily;
    let dShadow = shadowStyle;
    let dSpacing = spacingScale;

    // 1. BRAND ARCHITECTURAL PRESETS
    if (p.includes("apple")) {
      dStyle = "apple";
      detectedPalette = "mono-light";
      dBorder = "xl";
      dFont = "sans";
      dShadow = "none";
      dSpacing = "wide";
      detectedDesc = "Website minimalista com foco em tipografia fina, grelha limpa e espaço em branco generoso.";
    } 
    else if (p.includes("tesla")) {
      dStyle = "tesla";
      detectedPalette = "indigo-purple";
      dBorder = "md";
      dFont = "display";
      dShadow = "glow";
      dSpacing = "normal";
      detectedDesc = "Layout de ecrã imersivo, com tipografia arrojada e visual futurista de alta fidelidade.";
    }
    else if (p.includes("stripe")) {
      dStyle = "stripe";
      detectedPalette = "indigo-purple";
      dBorder = "xl";
      dFont = "sans";
      dShadow = "lg";
      dSpacing = "normal";
      detectedDesc = "Estética SaaS premium com gradientes oblíquos, grelhas complexas e botões dinâmicos.";
    }
    else if (p.includes("notion")) {
      dStyle = "notion";
      detectedPalette = "mono-light";
      dBorder = "md";
      dFont = "sans";
      dShadow = "none";
      dSpacing = "compact";
      detectedDesc = "Estrutura limpa estilo Notion, com barra lateral de navegação, emojis e margens finas de contraste.";
    }
    else if (p.includes("linear")) {
      dStyle = "linear";
      detectedPalette = "indigo-purple"; // Represents deep dark slate
      dBorder = "md";
      dFont = "mono";
      dShadow = "none";
      dSpacing = "compact";
      detectedDesc = "Visual técnico ultra escuro com contornos finos, acentos de código e secções estruturadas.";
    }
    else if (p.includes("vercel")) {
      dStyle = "vercel";
      detectedPalette = "mono-light"; // Stark black/white mode
      dBorder = "none";
      dFont = "mono";
      dShadow = "none";
      dSpacing = "normal";
      detectedDesc = "Visual stark minimalista com cantos retos, contrastes a preto e branco e cabeçalhos arrojados.";
    }
    else if (p.includes("airbnb")) {
      dStyle = "airbnb";
      detectedPalette = "emerald-dark"; // Soft layout with red accent
      dBorder = "xl";
      dFont = "sans";
      dShadow = "sm";
      dSpacing = "normal";
      detectedDesc = "Grelha acolhedora de fotos, focada em simplicidade, contornos arredondados e botões chamativos.";
    }

    // 2. SECTORS & SERVICES AUTO-FEATURES
    if (p.includes("restaurante") || p.includes("pizzaria") || p.includes("comida")) {
      detectedCat = "Restaurante & Gastronomia";
      detectedDesc = "Um menu de sabores requintados feito por profissionais de cozinha.";
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
      if (!detectedFeatures.includes("whatsapp")) detectedFeatures.push("whatsapp");
      if (!detectedFeatures.includes("depoimentos")) detectedFeatures.push("depoimentos");
    }
    else if (p.includes("advogado") || p.includes("clinica") || p.includes("medico")) {
      detectedCat = "Clínica & Apoio Profissional";
      detectedDesc = "Atendimento rigoroso focado na excelência e bem-estar do cliente.";
      if (!detectedFeatures.includes("faq")) detectedFeatures.push("faq");
      if (!detectedFeatures.includes("contactos")) detectedFeatures.push("contactos");
    }

    // 3. REACTIVE ADJUSTMENTS (Colors / Fonts / Spacings)
    if (p.includes("azul") || p.includes("indigo")) detectedPalette = "indigo-purple";
    if (p.includes("verde") || p.includes("esmeralda")) detectedPalette = "emerald-dark";
    if (p.includes("dourado") || p.includes("preto")) detectedPalette = "blue-gold";
    if (p.includes("claro") || p.includes("branco")) detectedPalette = "mono-light";
    if (p.includes("vermelho") || p.includes("red")) detectedPalette = "red";

    if (p.includes("espaço") || p.includes("afasta")) dSpacing = "wide";
    if (p.includes("compacto") || p.includes("junto")) dSpacing = "compact";
    if (p.includes("arredondado") || p.includes("redondo")) dBorder = "full";
    if (p.includes("quadrado") || p.includes("reto")) dBorder = "none";
    if (p.includes("serif")) dFont = "serif";
    if (p.includes("mono")) dFont = "mono";

    if (p.includes("whatsapp")) {
      if (!detectedFeatures.includes("whatsapp")) detectedFeatures.push("whatsapp");
    }
    if (p.includes("galeria")) {
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    }
    if (p.includes("faq")) {
      if (!detectedFeatures.includes("faq")) detectedFeatures.push("faq");
    }

    // Extract potential brand name
    const nameMatch = prompt.match(/chamad[oa]\s+["']?([^"']+)["']?/i) || prompt.match(/nome\s+["']?([^"']+)["']?/i);
    if (nameMatch && nameMatch[1]) {
      detectedName = nameMatch[1].trim();
    }

    return {
      name: detectedName,
      category: detectedCat,
      description: detectedDesc,
      palette: detectedPalette,
      features: detectedFeatures,
      style: dStyle,
      border: dBorder,
      font: dFont,
      shadow: dShadow,
      spacing: dSpacing
    };
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text, timestamp: new Date() }]);
    setInputValue("");
    setAiTyping(true);

    const thoughts = [
      "❯ Analisando linguagem natural...",
      "❯ Reconfigurando grelhas de layout...",
      "❯ Escolhendo presets estruturais do Design System...",
      "❯ A gravar definições de marca no Supabase..."
    ];

    let tIdx = 0;
    const thoughtInterval = setInterval(() => {
      if (tIdx < thoughts.length) {
        setActiveLogs(prev => [...prev, thoughts[tIdx]]);
        tIdx++;
      } else {
        clearInterval(thoughtInterval);
      }
    }, 200);

    setTimeout(async () => {
      const design = interpretUserPrompt(text);
      
      setBrandName(design.name);
      setCategory(design.category);
      setDescription(design.description);
      setPalette(design.palette);
      setFeatures(design.features);

      // Apply Layout architecture parameters
      setBrandStyle(design.style);
      setBorderRadius(design.border);
      setFontFamily(design.font);
      setShadowStyle(design.shadow);
      setSpacingScale(design.spacing);

      setIsCompleted(true);

      // Serialize configurations for database column
      const serializedPalette = `${design.palette}:${design.style}:${design.border}:${design.font}:${design.shadow}:${design.spacing}`;

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

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `Entendido! Reestruturei por completo o layout de **${design.name}** para seguir a arquitetura visual **${design.style.toUpperCase()}**.\n\nExplicação do Design System:\n✓ Preset de Marca: *${design.style}*\n✓ Escala de Espaçamento: *${design.spacing}*\n✓ Bordas: *${design.border}*\n✓ Tipografia: *${design.font}*\n\nQue modificações estruturais gostarias de fazer a seguir?`,
          timestamp: new Date()
        }
      ]);

      canvasConfetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });

      setAiTyping(false);
      setActiveLogs([]);
    }, 1500);
  };

  const handleSurpriseMe = () => {
    const creativeIdeas = [
      "Quero um website estilo Notion minimalista em tons claros.",
      "Cria um site estilo Tesla futurista com brilho neon.",
      "Quero um site estilo Stripe moderno com botões em gradiente.",
      "Faz um site estilo Linear técnico ultra escuro com contornos finos."
    ];
    const randomPrompt = creativeIdeas[Math.floor(Math.random() * creativeIdeas.length)];
    handleSend(randomPrompt);
  };

  // Helper variables mappings for preview styles
  const getThemeClasses = () => {
    if (brandStyle === "notion") {
      return {
        bg: "bg-[#FBFBFA]",
        card: "bg-transparent border border-slate-200/80 shadow-none text-slate-800",
        textAccent: "text-slate-900 font-bold",
        btnAccent: "bg-slate-900 hover:bg-slate-800 text-white rounded shadow-sm",
        btnOutline: "border-slate-350 hover:bg-slate-100 text-slate-900 rounded"
      };
    }
    if (brandStyle === "linear") {
      return {
        bg: "bg-[#0b0c10]",
        card: "bg-[#12131a] border border-slate-800/80 shadow-none text-slate-300",
        textAccent: "text-purple-400 font-mono",
        btnAccent: "bg-[#5c6bc0] hover:bg-[#3f51b5] text-white border border-[#7986cb]",
        btnOutline: "border-slate-800 hover:bg-slate-900 text-white"
      };
    }
    if (brandStyle === "vercel") {
      return {
        bg: "bg-black",
        card: "bg-black border border-white/10 rounded-none text-white",
        textAccent: "text-white font-bold",
        btnAccent: "bg-white hover:bg-slate-100 text-black rounded-none font-bold",
        btnOutline: "border-white/15 hover:bg-white/5 text-white rounded-none"
      };
    }

    // Default palettes
    switch (palette) {
      case "red":
        return {
          bg: "bg-[#1a0505]",
          card: "bg-[#2b0c0c]/80 border-red-500/20",
          textAccent: "text-red-500",
          btnAccent: "bg-red-650 hover:bg-red-750 text-white font-bold",
          btnOutline: "border-red-500/30 hover:bg-red-500/10 text-white"
        };
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

  const previewTheme = getThemeClasses();

  const getBorderRadiusClass = () => {
    if (brandStyle === "vercel") return "rounded-none";
    if (brandStyle === "notion") return "rounded";
    
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
    if (brandStyle === "vercel" || brandStyle === "linear") return "font-mono";
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
    if (brandStyle === "notion" || brandStyle === "vercel") return "shadow-none";
    switch (shadowStyle) {
      case "none": return "shadow-none border-white/5";
      case "sm": return "shadow-sm border-white/5";
      case "lg": return "shadow-2xl border-white/10";
      case "glow":
      default:
        return palette === "red"
          ? "shadow-[0_0_22px_rgba(239,68,68,0.18)] border-red-500/20"
          : palette === "emerald-dark" 
          ? "shadow-[0_0_22px_rgba(16,185,129,0.15)] border-emerald-500/20"
          : palette === "indigo-purple"
          ? "shadow-[0_0_22px_rgba(99,102,241,0.18)] border-indigo-500/20"
          : "shadow-[0_0_22px_rgba(212,175,55,0.16)] border-brand-gold/20";
    }
  };

  const getSpacingClass = () => {
    switch (spacingScale) {
      case "compact": return "py-10 space-y-4";
      case "wide": return "py-24 space-y-12";
      case "normal":
      default:
        return "py-16 space-y-8";
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
    }

    return { heroTitle, heroSubtitle, services };
  };

  const previewContent = getGeneratedContent();
  const isLight = palette === "mono-light" || brandStyle === "notion";

  return (
    <div className="relative w-full h-screen bg-[#030712] overflow-hidden flex flex-col justify-between text-slate-100">
      
      {/* Background graphic */}
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
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">AI Designer Agent v5.0</span>
        </div>
        <Image
          src="/logonovo.png"
          alt="MD Sites Logo"
          width={120}
          height={34}
          className="h-6 w-auto object-contain"
        />
      </header>

      {/* Two Columns Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: AI Copilot Chat panel */}
        <div className="w-full lg:w-[480px] border-r border-slate-800/80 flex flex-col bg-slate-950/40 backdrop-blur-md relative z-20 flex-shrink-0">
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
              AI Designer Conversacional
            </span>
            <button 
              onClick={handleSurpriseMe}
              className="text-[10px] font-bold text-brand-gold hover:text-white bg-brand-gold/15 hover:bg-brand-gold/25 px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 border border-brand-gold/25"
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
                </div>
              </div>
            ))}

            {aiTyping && (
              <div className="flex flex-col items-start space-y-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-350 space-y-2.5 rounded-tl-none w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                    <span className="font-bold text-white">O Copilot está a redesenhar...</span>
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
            <div ref={messagesEndRef} />
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
                placeholder="Peça qualquer alteração (Ex: 'Muda tudo para estilo Stripe')"
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
          
          {/* Browser Address bar */}
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

          {/* Preview Screen */}
          <div className="flex-1 overflow-hidden p-6 flex justify-center items-start bg-slate-900/10">
            <div className={`h-full border border-slate-800 bg-black/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[680px]" : "w-[360px]"
            }`}>
              
              {/* Dynamic Live website page */}
              <div className={`h-full overflow-y-auto relative transition-all duration-500 ${previewTheme.bg} ${
                isLight ? "text-slate-850" : "text-slate-350"
              } ${getFontFamilyClass()} flex`}>

                {/* NOTION SIDEBAR VARIANT */}
                {brandStyle === "notion" && previewMode === "desktop" && (
                  <div className="w-52 h-full bg-[#f7f7f5] border-r border-slate-200/80 p-4 space-y-4 text-xs text-slate-500 font-semibold select-none flex-shrink-0">
                    <div className="text-slate-800 font-bold flex items-center gap-1.5">
                      <span>📝</span> {brandName}
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div className="text-slate-700 hover:bg-slate-200/50 p-1.5 rounded cursor-pointer">🏠 Página Inicial</div>
                      {features.includes("servicos") && <div className="text-slate-700 hover:bg-slate-200/50 p-1.5 rounded cursor-pointer">⚙️ Serviços</div>}
                      {features.includes("galeria") && <div className="text-slate-700 hover:bg-slate-200/50 p-1.5 rounded cursor-pointer">🖼️ Galeria</div>}
                      {features.includes("faq") && <div className="text-slate-700 hover:bg-slate-200/50 p-1.5 rounded cursor-pointer">❓ Perguntas</div>}
                    </div>
                  </div>
                )}

                {/* MAIN PAGE CONTAINER */}
                <div className="flex-1 flex flex-col justify-between min-h-full">
                  
                  <div>
                    {/* DYNAMIC HEADER VARIANT */}
                    {brandStyle === "vercel" ? (
                      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black select-none">
                        <div className="font-mono text-white font-extrabold flex items-center gap-2">
                          <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white" />
                          {brandName.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-6 text-xs text-slate-400 font-semibold">
                          <span className="hover:text-white cursor-pointer transition-colors">INÍCIO</span>
                          {features.includes("servicos") && <span className="hover:text-white cursor-pointer transition-colors">SERVIÇOS</span>}
                        </div>
                      </div>
                    ) : brandStyle === "notion" ? (
                      /* Minimal Notion Header (e.g. mobile representation) */
                      previewMode !== "desktop" ? (
                        <div className="flex items-center justify-between p-4 border-b border-slate-200/60 bg-[#FBFBFA]">
                          <span className="font-bold text-slate-800">📝 {brandName}</span>
                          <span className="text-xs text-slate-500 font-bold">Menu ➔</span>
                        </div>
                      ) : null
                    ) : brandStyle === "stripe" ? (
                      /* Slanted gradient background header for Stripe */
                      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-6 pb-20 select-none">
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                          <div className="font-extrabold text-lg tracking-tight">{brandName}</div>
                          <div className="flex items-center gap-6 text-xs font-semibold">
                            <span className="hover:opacity-80 cursor-pointer">Início</span>
                            {features.includes("servicos") && <span className="hover:opacity-80 cursor-pointer">Serviços</span>}
                          </div>
                          <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-full text-[10px] font-bold">
                            Começar ➔
                          </button>
                        </div>
                        {/* Slant shape */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0f172a] transform skew-y-1 origin-bottom-left" />
                      </div>
                    ) : (
                      /* Classic Header */
                      <div className={`flex items-center justify-between p-6 border-b ${isLight ? "border-slate-200/60 bg-white/70" : "border-white/5 bg-[#030712]/30"}`}>
                        <div className={`font-bold text-lg flex items-center gap-1.5 font-display select-none ${isLight ? "text-slate-900" : "text-white"}`}>
                          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                            palette === "red" ? "bg-red-500" :
                            palette === "emerald-dark" ? "bg-emerald-400" :
                            palette === "indigo-purple" ? "bg-indigo-400" : "bg-[#d4af37]"
                          }`} />
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
                    {brandStyle === "notion" ? (
                      <div className="py-12 px-10 text-left space-y-6 max-w-2xl">
                        <div className="text-4xl">📝</div>
                        <h1 className="text-3.5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                          {previewContent.heroTitle}
                        </h1>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                          {previewContent.heroSubtitle}
                        </p>
                        <div className="pt-2">
                          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold shadow-sm">
                            Adicionar Nota / Começar
                          </button>
                        </div>
                      </div>
                    ) : brandStyle === "linear" ? (
                      <div className="py-20 px-8 text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[9px] font-mono border border-slate-800 bg-[#12131a] text-purple-400">
                          <span>⚙️</span> Linear Style Preview
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase font-mono">
                          {previewContent.heroTitle}
                        </h1>
                        <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-md mx-auto">
                          {previewContent.heroSubtitle}
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button className="px-4 py-2.5 rounded bg-[#5c6bc0] hover:bg-[#3f51b5] text-white border border-[#7986cb] text-xs font-bold font-mono">
                            Ver Projeto ➔
                          </button>
                          <button className="px-4 py-2.5 rounded border border-slate-850 hover:bg-slate-900 text-white text-xs font-mono">
                            Keymap
                          </button>
                        </div>
                      </div>
                    ) : brandStyle === "vercel" ? (
                      <div className="py-24 px-8 text-center space-y-8 max-w-3xl mx-auto bg-black">
                        <h1 className="text-5xl font-extrabold tracking-tighter text-white uppercase select-none">
                          {previewContent.heroTitle}
                        </h1>
                        <p className="text-xs text-slate-455 leading-relaxed font-mono max-w-md mx-auto">
                          {previewContent.heroSubtitle}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <button className="px-6 py-3 bg-white hover:bg-slate-100 text-black text-xs font-bold uppercase">
                            Deploy Now
                          </button>
                          <button className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white text-xs font-bold uppercase">
                            Read Docs
                          </button>
                        </div>
                      </div>
                    ) : brandStyle === "stripe" ? (
                      /* Stripe Hero */
                      <div className="py-16 px-8 text-left space-y-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                          <h1 className="text-3.5xl font-extrabold leading-tight text-white tracking-tight">
                            {previewContent.heroTitle}
                          </h1>
                          <p className="text-xs leading-relaxed text-slate-350">
                            {previewContent.heroSubtitle}
                          </p>
                          <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:shadow-lg text-white font-bold text-xs flex items-center gap-1">
                            Começar agora <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Mock Dashboard graph widget for Stripe style */}
                        <div className="w-full h-48 bg-[#1e293b]/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-[10px] text-slate-400 font-bold">Receitas / Vendas</span>
                            <span className="text-[9px] text-[#10b981] font-bold">+24%</span>
                          </div>
                          <div className="h-24 flex items-end justify-between gap-1 pt-4">
                            {[40, 60, 45, 90, 80, 100].map((h, i) => (
                              <div key={i} className="bg-indigo-500 rounded-t w-full" style={{ height: `${h}%` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Default Hero */
                      <div className="py-20 px-8 text-center space-y-6 max-w-2xl mx-auto">
                        <div className={`inline-flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-bold ${
                          isLight ? "bg-slate-200/80 text-slate-800" : "bg-white/5 border border-white/10 text-white"
                        }`}>
                          <Sparkles className={`w-3 h-3 ${previewTheme.textAccent}`} />
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
                            Fale Connosco
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SERVICES SECTION */}
                    {features.includes("servicos") && (
                      <div className={`${getSpacingClass()} px-8 border-t ${
                        isLight ? "border-slate-200/60" : "border-white/5"
                      } max-w-4xl mx-auto`}>
                        <div className="text-center space-y-1.5">
                          <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Nossos Serviços</h3>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Soluções feitas para si</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {previewContent.services.map((srv, idx) => (
                            <div 
                              key={idx} 
                              className={`p-5 flex flex-col justify-between h-[150px] transition-all ${getBorderRadiusClass()} ${
                                brandStyle === "notion" ? "bg-transparent border border-slate-200/80 shadow-none" :
                                brandStyle === "linear" ? "bg-[#12131a] border border-slate-800/85 font-mono shadow-none" :
                                brandStyle === "vercel" ? "bg-black border border-white/10 rounded-none shadow-none" :
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
                      <div className={`${getSpacingClass()} px-8 border-t ${
                        isLight ? "border-slate-200/60" : "border-white/5"
                      } max-w-4xl mx-auto`}>
                        <div className="text-center space-y-1.5">
                          <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Portfólio / Galeria</h3>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nosso trabalho recente</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={`aspect-video flex items-center justify-center text-[10px] border ${getBorderRadiusClass()} ${
                              brandStyle === "notion" ? "bg-transparent border border-slate-200" :
                              brandStyle === "vercel" ? "bg-black border border-white/10 rounded-none" :
                              previewTheme.card
                            } ${getShadowClass()}`}>
                              Imagem {i}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ SECTION */}
                    {features.includes("faq") && (
                      <div className={`${getSpacingClass()} px-8 border-t ${
                        isLight ? "border-slate-200/60" : "border-white/5"
                      } max-w-3xl mx-auto`}>
                        <h2 className={`text-xl font-bold text-center mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>Perguntas Frequentes</h2>
                        <div className="space-y-3">
                          {[
                            { q: "Quais são os vossos prazos de entrega?", a: "Dependendo da dimensão do projeto, tipicamente realizamos a entrega final num prazo de 3 a 7 dias úteis." },
                            { q: "Posso solicitar alterações após a publicação?", a: "Sim, suportamos facilidade de alteração e modificações continuas a qualquer momento." }
                          ].map((faq, fi) => (
                            <div key={fi} className={`p-4 border ${getBorderRadiusClass()} ${
                              brandStyle === "notion" ? "bg-transparent border border-slate-200" :
                              brandStyle === "vercel" ? "bg-black border border-white/10 rounded-none" :
                              previewTheme.card
                            } ${getShadowClass()}`}>
                              <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"} mb-1.5`}>{faq.q}</h4>
                              <p className="text-[10px] text-slate-455 leading-relaxed">{faq.a}</p>
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
                              isLight ? "border-slate-350 text-slate-800" : "border-white/10 text-white"
                            }`}
                          />
                          <textarea
                            rows={3}
                            placeholder="Mensagem..."
                            className={`w-full bg-black/10 border p-2.5 text-xs focus:outline-none resize-none ${getBorderRadiusClass()} ${
                              isLight ? "border-slate-350 text-slate-800" : "border-white/10 text-white"
                            }`}
                          />
                          <button className={`w-full py-2.5 text-xs font-bold ${getBorderRadiusClass()} ${previewTheme.btnAccent}`}>
                            Enviar Mensagem
                          </button>
                        </form>
                      </div>
                    )}

                  </div>

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
    </div>
  );
}
