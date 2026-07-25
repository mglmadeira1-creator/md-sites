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
  Code2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import canvasConfetti from "canvas-confetti";

// MD Sites Design Library imports
import { themes, ThemeConfig } from "@/components/design-system/themes";
import { 
  NavbarSection, 
  HeroSection, 
  ServicesSection, 
  GallerySection, 
  FAQSection, 
  TestimonialsSection, 
  FooterSection 
} from "@/components/design-system/sections";

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

  // Designer System layout states (Design Library)
  const [brandStyle, setBrandStyle] = useState("luxury"); // Maps to themes key
  const [borderRadius, setBorderRadius] = useState("xl"); // none, md, xl, full
  const [fontFamily, setFontFamily] = useState("sans"); // sans, mono, display, serif
  const [shadowStyle, setShadowStyle] = useState("glow"); // none, sm, lg, glow
  const [spacingScale, setSpacingScale] = useState("normal"); // compact, normal, wide

  // Dynamic Color Engine States
  const [primaryColor, setPrimaryColor] = useState("#d4af37"); // Accent color
  const [secondaryColor, setSecondaryColor] = useState("#0a0f1d"); // Background color
  const [isLightMode, setIsLightMode] = useState(false);

  // Custom Code Injector States (Developer low-code widgets)
  const [customCSS, setCustomCSS] = useState("");
  const [customHTML, setCustomHTML] = useState("");
  const [embedCode, setEmbedCode] = useState(""); // Iframe embeds
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
        text: "Olá! Sou o AI Copilot da MD Sites. 🤖\n\nEstou ligado à **MD Sites Design Library (Arquitetura Base)**.\n\nAgora posso montar o teu site utilizando componentes oficiais e o tema que desejares. Experimenta:\n• *'Cria um site estilo Apple minimalista em tons claros'*\n• *'Quero um website estilo Ferrari moderno'*\n• *'Faz um layout SaaS no tema Stripe com cores azul e roxo'*\n\nPodes alternar livremente entre o **Copilot Chat**, o **Editor Visual** e a aba de **Código Low-Code** no painel lateral!",
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

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // AI Prompt Parser (Architectural Layout Presets & ANY Color Combination)
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

    // 2. BRAND PRESETS ARCHITECTURE & THEME ASSIGNMENT
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
    else if (p.includes("linear")) {
      dStyle = "linear";
      detLight = false;
      dBorder = "md";
      dFont = "mono";
      dShadow = "none";
      dSpacing = "compact";
    }
    else if (p.includes("vercel")) {
      dStyle = "vercel";
      detLight = false;
      dBorder = "none";
      dFont = "mono";
      dShadow = "none";
      dSpacing = "normal";
    }
    else if (p.includes("spotify")) {
      dStyle = "spotify";
      detLight = false;
    }
    else if (p.includes("netflix")) {
      dStyle = "netflix";
      detLight = false;
    }
    else if (p.includes("nature")) {
      dStyle = "nature";
      detLight = true;
    }
    else if (p.includes("startup")) {
      dStyle = "startup";
      detLight = true;
    }

    // 3. SECTORS & WIDGETS
    if (p.includes("restaurante") || p.includes("pizzaria") || p.includes("comida")) {
      detectedCat = "Restaurante & Gastronomia";
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
      if (!detectedFeatures.includes("whatsapp")) detectedFeatures.push("whatsapp");
    }

    if (p.includes("espaço") || p.includes("afasta")) dSpacing = "wide";
    if (p.includes("arredondado") || p.includes("redondo")) dBorder = "full";
    if (p.includes("quadrado") || p.includes("reto")) dBorder = "none";

    // Set matching colors based on theme if user didn't specify manual colors in prompt
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
      "❯ Ajustando tokens estruturais e fontes...",
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

      // Colors engine apply
      setPrimaryColor(design.primaryColor);
      setSecondaryColor(design.secondaryColor);
      setIsLightMode(design.isLightMode);

      // Apply Layout architecture parameters
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
          text: `Entendido! Website **${design.name}** atualizado com sucesso seguindo a Design Library com o tema **${design.style.toUpperCase()}**.\n\nComponentes Montados:\n✓ Top Navigation (Navbar)\n✓ Hero Showcase (Hero)\n✓ Grelha Dinâmica (Serviços)\n✓ Rodapé Modular (Footer)\n\nPodes continuar a ajustar visualmente ou injetar código customizado.`,
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
    const serializedPalette = `${prim}:${seco}:${light}:${style}:${border}:${font}:${shadow}:${spacing}:${encodeURIComponent(customCSS)}:${encodeURIComponent(customHTML)}:${encodeURIComponent(embedCode)}`;

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

  const handleSurpriseMe = () => {
    const creativeIdeas = [
      "Quero um website estilo Notion minimalista.",
      "Cria um site no tema Tesla futurista.",
      "Quero um site no tema Stripe com cores rosa e roxo.",
      "Faz um site no tema Ferrari desportivo."
    ];
    const randomPrompt = creativeIdeas[Math.floor(Math.random() * creativeIdeas.length)];
    handleSend(randomPrompt);
  };

  // Reorder features list helper (Manual visual builder action)
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
    
    // Merge user custom manual colors if they overrides values
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

  const getGeneratedContent = () => {
    let services = [
      { name: "Consultoria Premium", desc: "Aconselhamento estratégico personalizado para otimizar os seus resultados." },
      { name: "Gestão Integrada", desc: "Tratamos dos processos complexos para que se foque no que realmente importa." },
      { name: "Suporte Dedicado", desc: "A nossa equipa técnica está sempre disponível para assegurar a máxima estabilidade." }
    ];

    if (category.toLowerCase().includes("restaurante") || category.toLowerCase().includes("gastronomia")) {
      services = [
        { name: "Menu de Degustação", desc: "Pratos de autor confecionados com ingredientes frescos e locais." },
        { name: "Eventos Privados", desc: "Espaço sofisticado para celebrar momentos marcantes com requinte." },
        { name: "Serviço de Reservas", desc: "Garanta a sua mesa com facilidade e desfrute de um atendimento exclusivo." }
      ];
    } else if (category.toLowerCase().includes("tecnologia") || category.toLowerCase().includes("saas")) {
      services = [
        { name: "Automação Avançada", desc: "Elimine tarefas manuais repetitivas e ganhe horas de produtividade diária." },
        { name: "Painel de Métricas", desc: "Dados consolidados em tempo real para tomada de decisões estratégicas." },
        { name: "Segurança de Dados", desc: "Criptografia avançada de ponta a ponta para proteger a sua informação." }
      ];
    }

    return {
      brandName,
      category,
      description,
      services
    };
  };

  const currentContent = getGeneratedContent();

  const sectionProps = {
    theme: activeTheme,
    borderRadius,
    fontFamily,
    shadow: shadowStyle,
    spacing: spacingScale,
    content: currentContent,
    features
  };

  return (
    <div className="relative w-full h-screen bg-[#030712] overflow-hidden flex flex-col justify-between text-slate-100">
      
      {/* Dynamic Style tags for developer low-code style overrides */}
      {customCSS && (
        <style dangerouslySetInnerHTML={{ __html: customCSS }} />
      )}

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
                <button 
                  onClick={handleSurpriseMe}
                  className="text-[10px] font-bold text-brand-gold hover:text-white bg-brand-gold/15 hover:bg-brand-gold/25 px-2.5 py-1.5 rounded-md transition-all border border-brand-gold/25"
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
                    placeholder="Pede modificações (Ex: 'Muda o tema para Apple')"
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
          )}

          {/* TAB 2: MANUAL VISUAL LAYOUT & DESIGN SYSTEM EDITOR */}
          {activeTab === "visual" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Brand presets / styling options */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-1.5">Design System Manual</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1">Tema base (Design Library)</label>
                    <select
                      value={brandStyle}
                      onChange={(e) => {
                        setBrandStyle(e.target.value);
                        // Pre-populate theme color values
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
                    <span className="text-[10px] uppercase font-bold text-slate-400">Ativar Modo Claro (Light Mode)</span>
                  </label>
                </div>

              </div>

              {/* Sections Reordering list */}
              <div className="space-y-3 pt-3">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-1.5">Grelha de Secções</h3>
                
                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={feat} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                      <span className="font-bold text-slate-300 capitalize">{feat}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => moveFeature(idx, "up")}
                          className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => moveFeature(idx, "down")}
                          className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => removeFeature(feat)}
                          className="p-1 hover:bg-rose-500/10 rounded text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new components buttons */}
                <div className="pt-2 space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500">Adicionar Componente:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: "servicos", name: "Serviços" },
                      { key: "galeria", name: "Galeria" },
                      { key: "faq", name: "Perguntas (FAQ)" },
                      { key: "depoimentos", name: "Testemunhos" },
                      { key: "contactos", name: "Contactos" },
                      { key: "whatsapp", name: "WhatsApp Widget" }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => addFeature(item.key)}
                        disabled={features.includes(item.key)}
                        className="px-2.5 py-1.5 text-[9px] font-bold border border-slate-800 hover:border-brand-gold/30 bg-[#111827] rounded text-slate-300 disabled:opacity-40"
                      >
                        + {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DEVELOPER LOW-CODE / CUSTOM CODE PANEL */}
          {activeTab === "code" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-850 pb-1">Low-Code & Código Custom</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Adiciona scripts externos, estilos CSS globais ou componentes criados a HTML puro.
                </p>
              </div>

              {/* Dynamic CSS styles box */}
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

              {/* Iframe widget box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Inserir Embed Code (Iframe)</label>
                <textarea
                  rows={4}
                  value={embedCode}
                  onChange={(e) => {
                    setEmbedCode(e.target.value);
                    handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, spacingScale, features);
                  }}
                  placeholder="Cola aqui qualquer iframe de YouTube, Spotify, Google Maps, etc."
                  className="w-full bg-[#050811] border border-slate-855 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:border-brand-gold/30 font-mono resize-none"
                />
              </div>

              {/* Dynamic HTML components creation */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Componente HTML Customizado</label>
                <textarea
                  rows={6}
                  value={customHTML}
                  onChange={(e) => {
                    setCustomHTML(e.target.value);
                    handleSyncToSupabase(brandName, category, description, primaryColor, secondaryColor, isLightMode, brandStyle, borderRadius, fontFamily, shadowStyle, spacingScale, features);
                  }}
                  placeholder="Ex: <div class='p-4 bg-emerald-500/10 border rounded'>Olá do Programador!</div>"
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
              
              {/* Dynamic Live website page */}
              <div 
                className="h-full overflow-y-auto relative transition-all duration-500 flex flex-col justify-between"
                style={{ backgroundColor: activeTheme.background }}
              >
                <div>
                  
                  {/* Navbar Section */}
                  <NavbarSection {...sectionProps} />

                  {/* Dynamic sections ordered layout list */}
                  {features.map((feat) => {
                    if (feat === "servicos") return <ServicesSection key={feat} {...sectionProps} />;
                    if (feat === "galeria") return <GallerySection key={feat} {...sectionProps} />;
                    if (feat === "faq") return <FAQSection key={feat} {...sectionProps} />;
                    if (feat === "depoimentos") return <TestimonialsSection key={feat} {...sectionProps} />;
                    return null;
                  })}

                  {/* Dynamic low-code HTML components */}
                  {customHTML && (
                    <div 
                      className="py-12 px-8 max-w-4xl mx-auto border-t"
                      style={{ borderColor: activeTheme.border }}
                      dangerouslySetInnerHTML={{ __html: customHTML }}
                    />
                  )}

                  {/* Dynamic Iframe Embeds */}
                  {embedCode && (
                    <div className="py-12 px-8 max-w-4xl mx-auto text-center border-t" style={{ borderColor: activeTheme.border }}>
                      <div 
                        className="w-full flex items-center justify-center overflow-hidden" 
                        dangerouslySetInnerHTML={{ __html: embedCode }}
                      />
                    </div>
                  )}

                  {/* Standard Hero fallback representation */}
                  {features.length === 0 && <HeroSection {...sectionProps} />}

                </div>

                {/* Footer Section */}
                <FooterSection {...sectionProps} />

                {/* WhatsApp button */}
                {features.includes("whatsapp") && (
                  <div className="absolute bottom-6 right-6 z-25 flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl cursor-pointer hover:scale-105 transition-all">
                    <MessageSquare className="w-6 h-6 fill-white" />
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
