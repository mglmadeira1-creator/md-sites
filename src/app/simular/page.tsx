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
  Shuffle,
  Code,
  Layout,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Settings,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import canvasConfetti from "canvas-confetti";

// MD Sites Design Library imports
import { themes, ThemeConfig } from "@/components/design-system/themes";
import { designTokens } from "@/components/design-system/tokens";

interface Message {
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function ConversationalCopilotBuilder() {
  const router = useRouter();

  // Mode Controller: Copilot Chat, Manual Visual Editor, or Developer Custom Code
  const [activeTab, setActiveTab] = useState<"copilot" | "visual" | "code">("copilot");
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null); // "navbar" | "hero" | "servicos" | "galeria" | "faq" | "depoimentos" | "contactos" | "footer"

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // Core brand content (Customizable manually via Visual Inspector Panel)
  const [brandName, setBrandName] = useState("A Minha Marca");
  const [category, setCategory] = useState("Serviços Profissionais");
  const [description, setDescription] = useState("Descreve o teu negócio e veja a IA criar os conteúdos.");
  const [features, setFeatures] = useState<string[]>(["servicos", "contactos"]);

  // Visual text overrides
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [servicesData, setServicesData] = useState<{ name: string; desc: string }[]>([
    { name: "Consultoria Premium", desc: "Aconselhamento estratégico personalizado para otimizar os seus resultados." },
    { name: "Gestão Integrada", desc: "Tratamos dos processos complexos para que se foque no que realmente importa." },
    { name: "Suporte Dedicado", desc: "A nossa equipa técnica está sempre disponível para assegurar a máxima estabilidade." }
  ]);
  const [faqData, setFaqData] = useState<{ q: string; a: string }[]>([
    { q: "Quais são os vossos prazos de entrega?", a: "Dependendo da complexidade do projeto, tipicamente realizamos a entrega final num prazo de 3 a 7 dias úteis." },
    { q: "Posso solicitar alterações após a publicação?", a: "Sim, suportamos facilidade de alteração e modificações continuas a qualquer momento." }
  ]);

  // Designer System layout states
  const [brandStyle, setBrandStyle] = useState("luxury"); 
  const [borderRadius, setBorderRadius] = useState("xl"); 
  const [fontFamily, setFontFamily] = useState("sans"); 
  const [shadowStyle, setShadowStyle] = useState("glow"); 
  const [spacingScale, setSpacingScale] = useState("normal"); 

  // Dynamic Color Engine States
  const [primaryColor, setPrimaryColor] = useState("#d4af37"); 
  const [secondaryColor, setSecondaryColor] = useState("#0a0f1d"); 
  const [isLightMode, setIsLightMode] = useState(false);

  // Custom Code Injector States
  const [customCSS, setCustomCSS] = useState("");
  const [customHTML, setCustomHTML] = useState("");
  const [embedCode, setEmbedCode] = useState(""); 
  const [globalHeaderScript, setGlobalHeaderScript] = useState("");

  const [isCompleted, setIsCompleted] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Colors Portuguese & English Map
  const colorMap: any = {
    azul: "#3b82f6",
    branco: "#ffffff",
    branca: "#ffffff",
    preto: "#090909",
    preta: "#090909",
    dourado: "#d4af37",
    dourada: "#d4af37",
    ouro: "#d4af37",
    vermelho: "#ef4444",
    vermelha: "#ef4444",
    verde: "#10b981",
    esmeralda: "#10b981",
    roxo: "#8b5cf6",
    roxa: "#8b5cf6",
    rosa: "#ec4899",
    laranja: "#f97316",
    amarelo: "#eab308",
    amarela: "#eab308",
    cinza: "#6b7280",
    cinzento: "#6b7280",
    blue: "#3b82f6",
    white: "#ffffff",
    black: "#090909",
    gold: "#d4af37",
    red: "#ef4444",
    green: "#10b981",
    purple: "#8b5cf6",
    pink: "#ec4899",
    orange: "#f97316",
    yellow: "#eab308",
    gray: "#6b7280"
  };

  // Initial Welcome
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Olá! Sou o AI Copilot da MD Sites. 🤖\n\nAgora podes editar qualquer componente **diretamente clicando nele** no ecrã de preview à direita!\n\nAo clicar, o painel de propriedades manuais correspondente abrirá automaticamente para alterares textos, links, cores e muito mais.",
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
              setPrimaryColor(parts[0] || "#d4af37");
              setSecondaryColor(parts[1] || "#0a0f1d");
              setIsLightMode(parts[2] === "true");
              setBrandStyle(parts[3] || "luxury");
              setBorderRadius(parts[4] || "xl");
              setFontFamily(parts[5] || "sans");
              setShadowStyle(parts[6] || "glow");
              setSpacingScale(parts[7] || "normal");
              if (parts[8]) setCustomCSS(decodeURIComponent(parts[8]));
              if (parts[9]) setCustomHTML(decodeURIComponent(parts[9]));
              if (parts[10]) setEmbedCode(decodeURIComponent(parts[10]));
              if (parts[11]) setHeroTitle(decodeURIComponent(parts[11]));
              if (parts[12]) setHeroSubtitle(decodeURIComponent(parts[12]));
              if (parts[13]) {
                try {
                  setServicesData(JSON.parse(decodeURIComponent(parts[13])));
                } catch(e){}
              }
              if (parts[14]) {
                try {
                  setFaqData(JSON.parse(decodeURIComponent(parts[14])));
                } catch(e){}
              }
            } else {
              setPrimaryColor(data.palette);
            }

            setMessages(prev => [
              ...prev,
              {
                sender: "ai",
                text: `Carreguei com sucesso o website **${data.name}**. Que modificações de design ou novas cores gostarias que eu aplicasse no Design System hoje?`,
                timestamp: new Date()
              }
            ]);
          }
        };
        fetchWebsite();
      }
    }
  }, []);

  // AI Prompt Parser
  const interpretUserPrompt = (prompt: string) => {
    const p = prompt.toLowerCase();
    
    let detectedCat = category;
    let detectedDesc = description;
    let detectedName = brandName;
    let detectedFeatures = [...features];

    // Colors dynamic setup
    let detPrimary = primaryColor;
    let detSecondary = secondaryColor;
    let detLight = isLightMode;

    // Design layout defaults
    let dStyle = brandStyle;
    let dBorder = borderRadius;
    let dFont = fontFamily;
    let dShadow = shadowStyle;
    let dSpacing = spacingScale;

    // 1. EXTRACT ANY TWO COLORS OR SINGLE COLOR FROM CHAT PROMPT
    const words = p.split(/[\s,]+/);
    const foundColors: string[] = [];
    for (const w of words) {
      const cleanWord = w.replace(/[^a-zA-Záéíóúàèìòùâêîôûãõç]/g, "");
      if (colorMap[cleanWord]) {
        foundColors.push(colorMap[cleanWord]);
      }
    }

    if (foundColors.length >= 2) {
      detPrimary = foundColors[0];
      detSecondary = foundColors[1];
      if (foundColors.includes("#ffffff")) {
        detLight = true;
        detPrimary = foundColors.find(c => c !== "#ffffff") || "#3b82f6";
      } else {
        detLight = false;
      }
    } else if (foundColors.length === 1) {
      detPrimary = foundColors[0];
      if (detPrimary === "#ffffff") {
        detLight = true;
        detPrimary = "#3b82f6";
      } else {
        detLight = false;
        detSecondary = "#0a0f1d";
      }
    }

    if (p.includes("branco") || p.includes("claro") || p.includes("white") || p.includes("light")) {
      detLight = true;
    }
    if (p.includes("preto") || p.includes("escuro") || p.includes("black") || p.includes("dark")) {
      detLight = false;
      detSecondary = "#090909";
    }

    // 2. BRAND PRESETS
    if (p.includes("apple")) {
      dStyle = "apple";
      detLight = true;
      dBorder = "xl";
      dFont = "sans";
      dShadow = "none";
      dSpacing = "wide";
    } 
    else if (p.includes("tesla")) {
      dStyle = "tesla";
      detLight = false;
      dBorder = "md";
      dFont = "display";
      dShadow = "glow";
      dSpacing = "normal";
    }
    else if (p.includes("ferrari")) {
      dStyle = "ferrari";
      detLight = false;
      dBorder = "none";
      dFont = "display";
      dShadow = "glow";
    }
    else if (p.includes("stripe")) {
      dStyle = "stripe";
      detLight = false;
      dBorder = "xl";
      dFont = "sans";
      dShadow = "lg";
      dSpacing = "normal";
    }
    else if (p.includes("notion")) {
      dStyle = "notion";
      detLight = true;
      dBorder = "md";
      dFont = "sans";
      dShadow = "none";
      dSpacing = "compact";
    }

    if (foundColors.length === 0 && themes[dStyle]) {
      detPrimary = themes[dStyle].primary;
      detSecondary = themes[dStyle].secondary;
      detLight = themes[dStyle].isLight;
    }

    return {
      name: detectedName,
      category: detectedCat,
      description: detectedDesc,
      features: detectedFeatures,
      style: dStyle,
      border: dBorder,
      font: dFont,
      shadow: dShadow,
      spacing: dSpacing,
      primaryColor: detPrimary,
      secondaryColor: detSecondary,
      isLightMode: detLight
    };
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text, timestamp: new Date() }]);
    setInputValue("");
    setAiTyping(true);

    const thoughts = [
      "❯ Analisando linguagem natural...",
      "❯ Selecionando Componentes da Design Library...",
      "❯ Preservando as tuas alterações manuais no painel...",
      "❯ A gravar definições no Supabase..."
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
      setFeatures(design.features);

      // Colors apply
      setPrimaryColor(design.primaryColor);
      setSecondaryColor(design.secondaryColor);
      setIsLightMode(design.isLightMode);

      setBrandStyle(design.style);
      setBorderRadius(design.border);
      setFontFamily(design.font);
      setShadowStyle(design.shadow);
      setSpacingScale(design.spacing);

      setIsCompleted(true);

      // Save to Supabase
      await handleSyncToSupabase(
        design.name,
        design.category,
        design.description,
        design.primaryColor,
        design.secondaryColor,
        design.isLightMode,
        design.style,
        design.border,
        design.font,
        design.shadow,
        design.spacing,
        design.features
      );

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `Entendido! Atualizei o website respeitando todas as tuas edições manuais anteriores.\n\nTema Base: **${design.style.toUpperCase()}**`,
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

  const handleSyncToSupabase = async (
    name = brandName, 
    cat = category, 
    desc = description, 
    prim = primaryColor, 
    seco = secondaryColor, 
    light = isLightMode, 
    style = brandStyle, 
    border = borderRadius, 
    font = fontFamily, 
    shadow = shadowStyle, 
    spacing = spacingScale, 
    activeFeats = features
  ) => {
    // Serialize design vars including visual overrides
    const serializedPalette = `${prim}:${seco}:${light}:${style}:${border}:${font}:${shadow}:${spacing}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}:${encodeURIComponent(heroTitle)}:${encodeURIComponent(heroSubtitle)}:${encodeURIComponent(JSON.stringify(servicesData))}:${encodeURIComponent(JSON.stringify(faqData))}`;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomHash = Math.random().toString(36).substring(2, 6);
    const websiteUrl = editId 
      ? `${slug}.mdsites.app`
      : `${slug || "site"}-${randomHash}.mdsites.app`;

    const payload = {
      name,
      category: cat,
      description: desc,
      palette: serializedPalette,
      features: activeFeats,
      url: websiteUrl,
      status: "Publicado"
    };

    if (editId) {
      await supabase.from("websites").update(payload).eq("id", editId);
    } else {
      await supabase.from("websites").insert([payload]);
    }
  };

  const handleSelectComponent = (comp: string) => {
    setSelectedComponent(comp);
    setActiveTab("visual");
  };

  // Reorder features list helper
  const moveFeature = (index: number, direction: "up" | "down") => {
    const nextFeats = [...features];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextFeats.length) return;
    const temp = nextFeats[index];
    nextFeats[index] = nextFeats[targetIdx];
    nextFeats[targetIdx] = temp;
    setFeatures(nextFeats);
    handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, spacingScale, nextFeats);
  };

  const removeFeature = (feat: string) => {
    const next = features.filter(f => f !== feat);
    setFeatures(next);
    handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, spacingScale, next);
  };

  const addFeature = (feat: string) => {
    if (!features.includes(feat)) {
      const next = [...features, feat];
      setFeatures(next);
      handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, spacingScale, next);
    }
  };

  // Construct active theme configurations
  const getActiveTheme = (): ThemeConfig => {
    const defaultTheme = themes[brandStyle] || themes.luxury;
    return {
      ...defaultTheme,
      primary: primaryColor,
      secondary: secondaryColor,
      surface: isLightMode ? "#ffffff" : "#111827",
      background: isLightMode ? "#f8fafc" : secondaryColor,
      border: isLightMode ? "rgba(0, 0, 0, 0.08)" : `${primaryColor}20`,
      textPrimary: isLightMode ? "#0f172a" : "#ffffff",
      textSecondary: isLightMode ? "#475569" : "#9ca3af",
      isLight: isLightMode
    };
  };

  const activeTheme = getActiveTheme();

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
        return `shadow-[0_0_22px_${primaryColor}25] border-white/5`;
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

  return (
    <div className="relative w-full h-screen bg-[#030712] overflow-hidden flex flex-col justify-between text-slate-100">
      
      {/* Dynamic Style tags */}
      {customCSS && (
        <style dangerouslySetInnerHTML={{ __html: customCSS }} />
      )}

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

      {/* Main split dashboard view */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Editor controls */}
        <div className="w-full lg:w-[480px] border-r border-slate-800/80 flex flex-col bg-slate-950/40 backdrop-blur-md relative z-20 flex-shrink-0">
          
          {/* Header tab controller */}
          <div className="grid grid-cols-3 border-b border-slate-850 bg-slate-950">
            <button
              onClick={() => setActiveTab("copilot")}
              className={`py-3.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "copilot" ? "text-brand-gold border-brand-gold bg-white/5" : "text-slate-450 border-transparent hover:text-white"
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5 text-brand-gold" />
              Copilot Chat
            </button>
            <button
              onClick={() => setActiveTab("visual")}
              className={`py-3.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "visual" ? "text-brand-gold border-brand-gold bg-white/5" : "text-slate-450 border-transparent hover:text-white"
              }`}
            >
              <Layout className="w-4.5 h-4.5 text-brand-gold" />
              Editor Visual
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`py-3.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "code" ? "text-brand-gold border-brand-gold bg-white/5" : "text-slate-450 border-transparent hover:text-white"
              }`}
            >
              <Code className="w-4.5 h-4.5 text-brand-gold" />
              Código Low-Code
            </button>
          </div>

          {/* TAB 1: AI COPILOT CHAT PANEL */}
          {activeTab === "copilot" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between flex-shrink-0">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
                  AI Designer Conversacional
                </span>
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
                        <span className="font-bold text-white">O Copilot está a processar...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Chat input */}
              <div className="p-4 border-t border-slate-800/85 bg-slate-950/60 flex-shrink-0">
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
                    placeholder="Instrua a IA (Ex: 'Muda as cores para tema Apple')"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/30"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark flex items-center justify-center"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL VISUAL INSPECTOR PANEL */}
          {activeTab === "visual" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Back to general settings if a sub-component is selected */}
              {selectedComponent ? (
                <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                  <button 
                    onClick={() => setSelectedComponent(null)}
                    className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-xs font-bold text-slate-205 uppercase tracking-wider">
                      Propriedades: {selectedComponent.toUpperCase()}
                    </h3>
                    <p className="text-[10px] text-slate-500">Edição manual isolada por componente</p>
                  </div>
                </div>
              ) : (
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-1.5">Definições Globais</h3>
              )}

              {/* GENERAL GLOBAL CONFIGS IF NO COMPONENT IS SELECTED */}
              {!selectedComponent && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1">Tema base</label>
                      <select
                        value={brandStyle}
                        onChange={(e) => {
                          setBrandStyle(e.target.value);
                          if (themes[e.target.value]) {
                            setPrimaryColor(themes[e.target.value].primary);
                            setSecondaryColor(themes[e.target.value].secondary);
                            setIsLightMode(themes[e.target.value].isLight);
                          }
                          handleSyncToSupabase(brandName, category, description, themes[e.target.value]?.primary, themes[e.target.value]?.secondary, themes[e.target.value]?.isLight, e.target.value);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                      >
                        {Object.keys(themes).map(th => (
                          <option key={th} value={th}>{th.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-455 uppercase block mb-1">Tipografia</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => {
                          setFontFamily(e.target.value);
                          handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, e.target.value);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                      >
                        {["sans", "mono", "display", "serif"].map(fn => (
                          <option key={fn} value={fn}>{fn.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1">Bordas / Cantos</label>
                      <select
                        value={borderRadius}
                        onChange={(e) => {
                          setBorderRadius(e.target.value);
                          handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, e.target.value);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                      >
                        {["none", "md", "xl", "full"].map(bd => (
                          <option key={bd} value={bd}>{bd.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-455 uppercase block mb-1">Margens / Spacing</label>
                      <select
                        value={spacingScale}
                        onChange={(e) => {
                          setSpacingScale(e.target.value);
                          handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, e.target.value);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                      >
                        {["compact", "normal", "wide"].map(sp => (
                          <option key={sp} value={sp}>{sp.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Accent and BG Color Pickers */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1">Cor Principal (Hex)</label>
                      <div className="flex gap-1.5">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => {
                            setPrimaryColor(e.target.value);
                            handleSyncToSupabase(brandName, category, description, e.target.value);
                          }}
                          className="w-8 h-8 rounded border border-slate-800 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={primaryColor} 
                          onChange={(e) => {
                            setPrimaryColor(e.target.value);
                            handleSyncToSupabase(brandName, category, description, e.target.value);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-white focus:outline-none text-center uppercase font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-455 uppercase block mb-1">Cor Secundária (Hex)</label>
                      <div className="flex gap-1.5">
                        <input 
                          type="color" 
                          value={secondaryColor} 
                          onChange={(e) => {
                            setSecondaryColor(e.target.value);
                            handleSyncToSupabase(brandName, category, description, primaryColor, e.target.value);
                          }}
                          className="w-8 h-8 rounded border border-slate-800 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={secondaryColor} 
                          onChange={(e) => {
                            setSecondaryColor(e.target.value);
                            handleSyncToSupabase(brandName, category, description, primaryColor, e.target.value);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-white focus:outline-none text-center uppercase font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input 
                        type="checkbox"
                        checked={isLightMode}
                        onChange={(e) => {
                          setIsLightMode(e.target.checked);
                          handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, e.target.checked);
                        }}
                        className="rounded border-slate-800 bg-slate-900 text-brand-gold focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[10px] uppercase font-bold text-slate-400">Ativar Modo Claro</span>
                    </label>
                  </div>

                  {/* Section List Reordering */}
                  <div className="pt-4 space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-slate-500">Ordem de Secções</h4>
                    <div className="space-y-2">
                      {features.map((feat, idx) => (
                        <div key={feat} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                          <span className="font-bold text-slate-300 capitalize">{feat}</span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => moveFeature(idx, "up")} className="p-1 hover:bg-white/5 rounded text-slate-400"><ArrowUp className="w-3.5 h-3.5" /></button>
                            <button onClick={() => moveFeature(idx, "down")} className="p-1 hover:bg-white/5 rounded text-slate-400"><ArrowDown className="w-3.5 h-3.5" /></button>
                            <button onClick={() => removeFeature(feat)} className="p-1 hover:bg-rose-500/10 rounded text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* INSPECTOR PANEL FOR NAVBAR */}
              {selectedComponent === "navbar" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nome da Marca (Logo Text)</label>
                    <input 
                      type="text"
                      value={brandName}
                      onChange={(e) => {
                        setBrandName(e.target.value);
                        handleSyncToSupabase(e.target.value);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* INSPECTOR PANEL FOR HERO */}
              {selectedComponent === "hero" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Título Principal (Hero Title)</label>
                    <input 
                      type="text"
                      value={heroTitle || `Soluções inteligentes para ${brandName}`}
                      onChange={(e) => {
                        setHeroTitle(e.target.value);
                        // Serialize into Supabase palette column custom variables slot
                        const prim = primaryColor;
                        const seco = secondaryColor;
                        const light = isLightMode;
                        const style = brandStyle;
                        const border = borderRadius;
                        const font = fontFamily;
                        const shadow = shadowStyle;
                        const spacing = spacingScale;
                        const activeFeats = features;
                        const serializedPalette = `${prim}:${seco}:${light}:${style}:${border}:${font}:${shadow}:${spacing}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}:${encodeURIComponent(e.target.value)}:${encodeURIComponent(heroSubtitle)}:${encodeURIComponent(JSON.stringify(servicesData))}:${encodeURIComponent(JSON.stringify(faqData))}`;
                        supabase.from("websites").update({ palette: serializedPalette }).eq("id", editId);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Subtítulo / Descrição</label>
                    <textarea 
                      rows={3}
                      value={heroSubtitle || description}
                      onChange={(e) => {
                        setHeroSubtitle(e.target.value);
                        const prim = primaryColor;
                        const seco = secondaryColor;
                        const light = isLightMode;
                        const style = brandStyle;
                        const border = borderRadius;
                        const font = fontFamily;
                        const shadow = shadowStyle;
                        const spacing = spacingScale;
                        const activeFeats = features;
                        const serializedPalette = `${prim}:${seco}:${light}:${style}:${border}:${font}:${shadow}:${spacing}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}:${encodeURIComponent(heroTitle)}:${encodeURIComponent(e.target.value)}:${encodeURIComponent(JSON.stringify(servicesData))}:${encodeURIComponent(JSON.stringify(faqData))}`;
                        supabase.from("websites").update({ palette: serializedPalette }).eq("id", editId);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {/* INSPECTOR PANEL FOR SERVICES */}
              {selectedComponent === "servicos" && (
                <div className="space-y-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Serviços Oferecidos</span>
                  {servicesData.map((srv, sIdx) => (
                    <div key={sIdx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                      <input 
                        type="text"
                        value={srv.name}
                        onChange={(e) => {
                          const updated = [...servicesData];
                          updated[sIdx].name = e.target.value;
                          setServicesData(updated);
                          // Sync changes
                          const serializedPalette = `${primaryColor}:${secondaryColor}:${isLightMode}:${brandStyle}:${borderRadius}:${fontFamily}:${shadowStyle}:${spacingScale}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}:${encodeURIComponent(heroTitle)}:${encodeURIComponent(heroSubtitle)}:${encodeURIComponent(JSON.stringify(updated))}:${encodeURIComponent(JSON.stringify(faqData))}`;
                          supabase.from("websites").update({ palette: serializedPalette }).eq("id", editId);
                        }}
                        placeholder="Nome do Serviço"
                        className="w-full bg-[#050811] border border-slate-850 rounded p-2 text-xs text-white"
                      />
                      <textarea 
                        rows={2}
                        value={srv.desc}
                        onChange={(e) => {
                          const updated = [...servicesData];
                          updated[sIdx].desc = e.target.value;
                          setServicesData(updated);
                          const serializedPalette = `${primaryColor}:${secondaryColor}:${isLightMode}:${brandStyle}:${borderRadius}:${fontFamily}:${shadowStyle}:${spacingScale}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}:${encodeURIComponent(heroTitle)}:${encodeURIComponent(heroSubtitle)}:${encodeURIComponent(JSON.stringify(updated))}:${encodeURIComponent(JSON.stringify(faqData))}`;
                          supabase.from("websites").update({ palette: serializedPalette }).eq("id", editId);
                        }}
                        placeholder="Descrição"
                        className="w-full bg-[#050811] border border-slate-855 rounded p-2 text-[10px] text-slate-300 resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* INSPECTOR PANEL FOR FAQ */}
              {selectedComponent === "faq" && (
                <div className="space-y-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lista de FAQ</span>
                  {faqData.map((faq, fIdx) => (
                    <div key={fIdx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                      <input 
                        type="text"
                        value={faq.q}
                        onChange={(e) => {
                          const updated = [...faqData];
                          updated[fIdx].q = e.target.value;
                          setFaqData(updated);
                          const serializedPalette = `${primaryColor}:${secondaryColor}:${isLightMode}:${brandStyle}:${borderRadius}:${fontFamily}:${shadowStyle}:${spacingScale}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}:${encodeURIComponent(heroTitle)}:${encodeURIComponent(heroSubtitle)}:${encodeURIComponent(JSON.stringify(servicesData))}:${encodeURIComponent(JSON.stringify(updated))}`;
                          supabase.from("websites").update({ palette: serializedPalette }).eq("id", editId);
                        }}
                        placeholder="Pergunta"
                        className="w-full bg-[#050811] border border-slate-850 rounded p-2 text-xs text-white"
                      />
                      <textarea 
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const updated = [...faqData];
                          updated[fIdx].a = e.target.value;
                          setFaqData(updated);
                          const serializedPalette = `${primaryColor}:${secondaryColor}:${isLightMode}:${brandStyle}:${borderRadius}:${fontFamily}:${shadowStyle}:${spacingScale}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}:${encodeURIComponent(heroTitle)}:${encodeURIComponent(heroSubtitle)}:${encodeURIComponent(JSON.stringify(servicesData))}:${encodeURIComponent(JSON.stringify(updated))}`;
                          supabase.from("websites").update({ palette: serializedPalette }).eq("id", editId);
                        }}
                        placeholder="Resposta"
                        className="w-full bg-[#050811] border border-slate-855 rounded p-2 text-[10px] text-slate-300 resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: DEVELOPER LOW-CODE / CUSTOM CODE PANEL */}
          {activeTab === "code" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-850 pb-1">Low-Code & Código Custom</h3>
                <p className="text-[10px] text-slate-505 leading-relaxed">
                  Adiciona scripts externos, estilos CSS globais ou componentes criados a HTML puro.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Injetar CSS Customizado</label>
                <textarea
                  rows={6}
                  value={customCSS}
                  onChange={(e) => {
                    setCustomCSS(e.target.value);
                    handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, spacingScale, features);
                  }}
                  placeholder="Ex: .services-card { border-radius: 50px; }"
                  className="w-full bg-[#050811] border border-slate-855 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:border-brand-gold/30 font-mono resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Inserir Embed Code (Iframe)</label>
                <textarea
                  rows={4}
                  value={embedCode}
                  onChange={(e) => {
                    setEmbedCode(e.target.value);
                    handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, spacingScale, features);
                  }}
                  placeholder="Cola aqui qualquer iframe de YouTube, Spotify, etc."
                  className="w-full bg-[#050811] border border-slate-855 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:border-brand-gold/30 font-mono resize-none"
                />
              </div>
            </div>
          )}

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
              
              {/* Dynamic Live website page with manual click-to-edit indicators */}
              <div 
                className={`h-full overflow-y-auto relative transition-all duration-500 flex flex-col justify-between ${getFontFamilyClass()}`}
                style={{ backgroundColor: activeTheme.background }}
              >
                <div>
                  
                  {/* Navbar Section */}
                  <div 
                    onClick={() => handleSelectComponent("navbar")}
                    className={`relative cursor-pointer group transition-all duration-200 border-2 ${
                      selectedComponent === "navbar" ? "border-brand-gold" : "border-transparent hover:border-brand-gold/30"
                    }`}
                  >
                    {/* Hover edit label */}
                    <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 bg-brand-gold text-brand-blue-dark text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-40 transition-opacity">
                      Editar Navbar
                    </div>

                    <div 
                      className={`flex items-center justify-between p-6 border-b transition-all duration-300`}
                      style={{
                        backgroundColor: activeTheme.surface,
                        borderColor: activeTheme.border
                      }}
                    >
                      <div 
                        className="font-bold text-lg flex items-center gap-1.5 select-none"
                        style={{ color: activeTheme.textPrimary }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: activeTheme.primary }} />
                        {brandName}
                      </div>
                      <div 
                        className="hidden sm:flex items-center gap-6 text-xs font-semibold select-none"
                        style={{ color: activeTheme.textSecondary }}
                      >
                        <span className="hover:opacity-85 cursor-pointer">Início</span>
                        {features.includes("servicos") && <span className="hover:opacity-85 cursor-pointer">Serviços</span>}
                        {features.includes("galeria") && <span className="hover:opacity-85 cursor-pointer">Galeria</span>}
                        {features.includes("depoimentos") && <span className="hover:opacity-85 cursor-pointer">Clientes</span>}
                      </div>
                    </div>
                  </div>

                  {/* Hero representation wrapper */}
                  <div 
                    onClick={() => handleSelectComponent("hero")}
                    className={`relative cursor-pointer group transition-all duration-200 border-2 ${
                      selectedComponent === "hero" ? "border-brand-gold" : "border-transparent hover:border-brand-gold/30"
                    }`}
                  >
                    <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 bg-brand-gold text-brand-blue-dark text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-40 transition-opacity">
                      Editar Hero
                    </div>

                    <div className={`text-center space-y-6 max-w-3xl mx-auto ${getSpacingClass()}`}>
                      <div 
                        className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full text-[10px] font-bold border"
                        style={{ 
                          borderColor: activeTheme.border, 
                          backgroundColor: activeTheme.surface,
                          color: activeTheme.primary 
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {category}
                      </div>
                      <h1 
                        className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight uppercase"
                        style={{ color: activeTheme.textPrimary }}
                      >
                        {heroTitle || `Soluções premium para ${brandName}`}
                      </h1>
                      <p 
                        className="text-xs leading-relaxed max-w-md mx-auto"
                        style={{ color: activeTheme.textSecondary }}
                      >
                        {heroSubtitle || description}
                      </p>
                      <div className="flex items-center justify-center gap-3.5 pt-2">
                        <button 
                          className={`px-5 py-3 text-xs font-bold transition-all hover:opacity-90 ${getBorderRadiusClass()}`}
                          style={{ backgroundColor: activeTheme.primary, color: activeTheme.isLight ? "#ffffff" : "#000000" }}
                        >
                          Explorar Serviços
                        </button>
                        <button 
                          className={`px-5 py-3 text-xs font-bold border transition-all hover:bg-white/5 ${getBorderRadiusClass()}`}
                          style={{ borderColor: activeTheme.border, color: activeTheme.textPrimary }}
                        >
                          Falar Connosco
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Services representation wrapper */}
                  {features.includes("servicos") && (
                    <div 
                      onClick={() => handleSelectComponent("servicos")}
                      className={`relative cursor-pointer group transition-all duration-200 border-2 ${
                        selectedComponent === "servicos" ? "border-brand-gold" : "border-transparent hover:border-brand-gold/30"
                      }`}
                    >
                      <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 bg-brand-gold text-brand-blue-dark text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-40 transition-opacity">
                        Editar Serviços
                      </div>

                      <div className={`border-t max-w-4xl mx-auto ${getSpacingClass()}`} style={{ borderColor: activeTheme.border }}>
                        <div className="text-center space-y-1.5 mb-8">
                          <h3 className="text-xl font-bold" style={{ color: activeTheme.textPrimary }}>Nossos Serviços</h3>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Soluções sob medida para o seu negócio</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {servicesData.map((srv, idx) => (
                            <div 
                              key={idx} 
                              className={`p-5 flex flex-col justify-between h-[155px] border transition-all duration-300 ${getBorderRadiusClass()} ${getShadowClass()}`}
                              style={{ 
                                backgroundColor: activeTheme.surface, 
                                borderColor: activeTheme.border 
                              }}
                            >
                              <div className="space-y-1.5">
                                <h4 className="text-xs font-bold" style={{ color: activeTheme.textPrimary }}>{srv.name}</h4>
                                <p className="text-[10px] leading-relaxed" style={{ color: activeTheme.textSecondary }}>{srv.desc}</p>
                              </div>
                              <span className="text-[10px] font-bold flex items-center gap-1 hover:opacity-85" style={{ color: activeTheme.primary }}>
                                ➔ Saber mais
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FAQ representation wrapper */}
                  {features.includes("faq") && (
                    <div 
                      onClick={() => handleSelectComponent("faq")}
                      className={`relative cursor-pointer group transition-all duration-200 border-2 ${
                        selectedComponent === "faq" ? "border-brand-gold" : "border-transparent hover:border-brand-gold/30"
                      }`}
                    >
                      <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 bg-brand-gold text-brand-blue-dark text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-40 transition-opacity">
                        Editar FAQ
                      </div>

                      <div className={`border-t max-w-3xl mx-auto ${getSpacingClass()}`} style={{ borderColor: activeTheme.border }}>
                        <h2 className="text-xl font-bold text-center mb-6" style={{ color: activeTheme.textPrimary }}>Perguntas Frequentes</h2>
                        <div className="space-y-3.5">
                          {faqData.map((faq, fi) => (
                            <div 
                              key={fi} 
                              className={`p-4.5 border ${getBorderRadiusClass()} ${getShadowClass()}`}
                              style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}
                            >
                              <h4 className="text-xs font-bold mb-1.5" style={{ color: activeTheme.textPrimary }}>{faq.q}</h4>
                              <p className="text-[10px] leading-relaxed" style={{ color: activeTheme.textSecondary }}>{faq.a}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Embed custom low-code widgets */}
                  {embedCode && (
                    <div className="py-12 px-8 max-w-4xl mx-auto text-center border-t" style={{ borderColor: activeTheme.border }}>
                      <div 
                        className="w-full flex items-center justify-center overflow-hidden" 
                        dangerouslySetInnerHTML={{ __html: embedCode }}
                      />
                    </div>
                  )}

                </div>

                {/* Footer Section */}
                <div 
                  className={`p-8 border-t text-center text-[10px] select-none`} 
                  style={{ borderColor: activeTheme.border, color: activeTheme.textSecondary }}
                  suppressHydrationWarning
                >
                  &copy; {new Date().getFullYear()} {brandName}. Desenvolvido com a MD Sites Design Library.
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
