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

  // Core brand settings
  const [brandName, setBrandName] = useState("A Minha Marca");
  const [category, setCategory] = useState("Serviços Profissionais");
  const [description, setDescription] = useState("Descreve o teu negócio e veja a IA criar os conteúdos.");
  const [palette, setPalette] = useState("blue-gold");
  const [features, setFeatures] = useState<string[]>(["servicos", "contactos"]);

  // Design System States (Copilot v4.0 Library of Components)
  const [heroVariant, setHeroVariant] = useState("modern"); // minimalist, modern, premium, creative, corporate, restaurant, hotel, saas, portfolio, loja, fotografia, luxo
  const [headerVariant, setHeaderVariant] = useState("sticky"); // minimal, glass, transparent, sticky, center, split, corporate, premium
  const [cardVariant, setCardVariant] = useState("glass"); // minimal, premium, glass, gradient, rounded, square, elevated, interactive
  const [ctaVariant, setCtaVariant] = useState("modern"); // modern, outline, filled, animated, gradient, floating
  const [footerVariant, setFooterVariant] = useState("corporate"); // minimal, corporate, premium, newsletter, multi-column
  const [borderRadius, setBorderRadius] = useState("xl"); // none, md, xl, full
  const [fontFamily, setFontFamily] = useState("sans"); // sans, mono, display, serif
  const [shadowStyle, setShadowStyle] = useState("glow"); // none, sm, lg, glow
  const [spacingScale, setSpacingScale] = useState("normal"); // compact, normal, wide

  const [isCompleted, setIsCompleted] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome Message from AI Copilot
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Olá! Sou o AI Copilot v4.0 da MD Sites. 🤖\n\nSou o teu Diretor Criativo e Designer de UI/UX dedicado. Não te limites a templates fixos. Descreve a tua ideia com linguagem natural:\n\n• *'Quero um site estilo Apple minimalista em tons cinza'* \n• *'Cria um site premium preto e dourado para uma marca de luxo'* \n• *'Cria um layout futurista Tesla com sombras neon'* \n• *'Cria um site moderno parecido com a Stripe'* \n\nEu cuidarei de todo o Design System e da estrutura!",
        timestamp: new Date(),
        suggestions: [
          "Cria um website minimalista estilo Apple.",
          "Cria um site de carros elétricos estilo Tesla.",
          "Quero um design moderno inspirado no Stripe.",
          "Faz um portfólio criativo inspirado no Spotify."
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

            // Deserialize complex v4.0 design params from database palette field
            const parts = data.palette.split(":");
            if (parts.length > 1) {
              setPalette(parts[0]);
              setHeroVariant(parts[1] || "modern");
              setCardVariant(parts[2] || "glass");
              setBorderRadius(parts[3] || "xl");
              setFontFamily(parts[4] || "sans");
              setShadowStyle(parts[5] || "glow");
              setHeaderVariant(parts[6] || "sticky");
              setCtaVariant(parts[7] || "modern");
              setFooterVariant(parts[8] || "corporate");
              setSpacingScale(parts[9] || "normal");
            } else {
              setPalette(data.palette);
            }

            setMessages(prev => [
              ...prev,
              {
                sender: "ai",
                text: `Carreguei com sucesso o website **${data.name}**. Que modificações de design ou novas secções gostarias que eu aplicasse no Design System hoje?`,
                timestamp: new Date(),
                suggestions: [
                  "Mudar para estilo Apple minimalista",
                  "Mudar para estilo Tesla futurista",
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

  // Dynamic Generator of Visual Ideas (✨ Gerar Outra Ideia)
  const handleGenerateOtherIdea = () => {
    if (!isCompleted) {
      handleSend("Cria um website profissional.");
      return;
    }

    setAiTyping(true);
    setActiveLogs([
      "❯ A rebarbar Design System...",
      "❯ A baralhar Biblioteca de Componentes...",
      "❯ A aplicar nova paleta e tipografia...",
      "❯ A reorganizar grelha de secções..."
    ]);

    setTimeout(() => {
      // Randomize everything except text content
      const heroes = ["minimalist", "modern", "premium", "creative", "corporate", "restaurant", "hotel", "saas", "portfolio", "loja", "fotografia", "luxo"];
      const headers = ["minimal", "glass", "transparent", "sticky", "center", "split", "corporate", "premium"];
      const cards = ["minimal", "premium", "glass", "gradient", "rounded", "square", "elevated", "interactive"];
      const ctas = ["modern", "outline", "filled", "animated", "gradient", "floating"];
      const footers = ["minimal", "corporate", "premium", "newsletter", "multi-column"];
      const borders = ["none", "md", "xl", "full"];
      const fonts = ["sans", "mono", "display", "serif"];
      const shadows = ["none", "sm", "lg", "glow"];
      const palettes = ["blue-gold", "indigo-purple", "emerald-dark", "mono-light"];
      const spacings = ["compact", "normal", "wide"];

      const rHero = heroes[Math.floor(Math.random() * heroes.length)];
      const rHeader = headers[Math.floor(Math.random() * headers.length)];
      const rCard = cards[Math.floor(Math.random() * cards.length)];
      const rCta = ctas[Math.floor(Math.random() * ctas.length)];
      const rFooter = footers[Math.floor(Math.random() * footers.length)];
      const rBorder = borders[Math.floor(Math.random() * borders.length)];
      const rFont = fonts[Math.floor(Math.random() * fonts.length)];
      const rShadow = shadows[Math.floor(Math.random() * shadows.length)];
      const rPalette = palettes[Math.floor(Math.random() * palettes.length)];
      const rSpacing = spacings[Math.floor(Math.random() * spacings.length)];

      setHeroVariant(rHero);
      setHeaderVariant(rHeader);
      setCardVariant(rCard);
      setCtaVariant(rCta);
      setFooterVariant(rFooter);
      setBorderRadius(rBorder);
      setFontFamily(rFont);
      setShadowStyle(rShadow);
      setPalette(rPalette);
      setSpacingScale(rSpacing);

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `Gerei uma nova proposta visual para **${brandName}** mantendo os mesmos conteúdos! Mudei o Hero para *${rHero}*, a paleta para *${rPalette}*, tipografia para *${rFont}* e cartões para *${rCard}*. O que achas desta nova alternativa?`,
          timestamp: new Date(),
          suggestions: [
            "Gosto desta, manter!",
            "Gerar outra ideia visual",
            "Mudar para estilo minimalista"
          ]
        }
      ]);

      canvasConfetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      setAiTyping(false);
      setActiveLogs([]);
    }, 1400);
  };

  // AI Prompt Parser (Copilot v4.0 Parser)
  const interpretUserPrompt = (prompt: string) => {
    const p = prompt.toLowerCase();
    
    let detectedCat = category;
    let detectedDesc = description;
    let detectedName = brandName;
    let detectedPalette = palette;
    let detectedFeatures = [...features];

    // Design System variables
    let dHero = heroVariant;
    let dHeader = headerVariant;
    let dCard = cardVariant;
    let dCta = ctaVariant;
    let dFooter = footerVariant;
    let dBorder = borderRadius;
    let dFont = fontFamily;
    let dShadow = shadowStyle;
    let dSpacing = spacingScale;

    // A. INSPIRING BRANDS
    if (p.includes("apple")) {
      detectedPalette = "mono-light";
      dHero = "minimalist";
      dHeader = "minimal";
      dCard = "minimal";
      dCta = "outline";
      dFooter = "minimal";
      dBorder = "xl";
      dFont = "sans";
      dShadow = "none";
      dSpacing = "wide";
      detectedDesc = "Interface minimalista ultra limpa inspirada nos padrões visuais da Apple.";
    } 
    else if (p.includes("tesla")) {
      detectedPalette = "indigo-purple";
      dHero = "premium";
      dHeader = "sticky";
      dCard = "premium";
      dCta = "filled";
      dFooter = "premium";
      dBorder = "md";
      dFont = "display";
      dShadow = "glow";
      dSpacing = "normal";
      detectedDesc = "Layout futurista e minimalista imersivo com cartões elevados e glows coloridos.";
    }
    else if (p.includes("stripe")) {
      detectedPalette = "indigo-purple";
      dHero = "saas";
      dHeader = "split";
      dCard = "interactive";
      dCta = "gradient";
      dFooter = "multi-column";
      dBorder = "xl";
      dFont = "sans";
      dShadow = "lg";
      dSpacing = "normal";
      detectedDesc = "Design moderno SaaS focado em conversão, com grelhas complexas e botões em gradiente.";
    }
    else if (p.includes("spotify")) {
      detectedPalette = "indigo-purple";
      dHero = "creative";
      dHeader = "glass";
      dCard = "glass";
      dCta = "floating";
      dFooter = "newsletter";
      dBorder = "full";
      dFont = "mono";
      dShadow = "glow";
      dSpacing = "compact";
    }

    // B. DIFFERENT PERSONALITIES
    if (p.includes("luxo") || p.includes("premium") || p.includes("elegante")) {
      detectedPalette = "blue-gold";
      dHero = "luxo";
      dHeader = "premium";
      dCard = "premium";
      dCta = "animated";
      dFooter = "premium";
      dBorder = "none";
      dFont = "serif";
      dShadow = "lg";
    }
    else if (p.includes("infantil") || p.includes("divertido") || p.includes("crianças")) {
      detectedPalette = "emerald-dark";
      dHero = "creative";
      dHeader = "center";
      dCard = "rounded";
      dCta = "floating";
      dFooter = "newsletter";
      dBorder = "full";
      dFont = "display";
      dShadow = "lg";
    }

    // C. CATEGORIES & SECTORS
    if (p.includes("restaurante") || p.includes("pizzaria") || p.includes("comida")) {
      detectedCat = "Restaurante & Cafetaria";
      detectedDesc = "Experiência de assinatura gastronómica autêntica.";
      dHero = "restaurant";
      dHeader = "classic";
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    }
    else if (p.includes("advogado") || p.includes("consultoria") || p.includes("juridico")) {
      detectedCat = "Apoio Jurídico & Fiscal";
      detectedDesc = "Representação e aconselhamento profissional focado em rigor e confiança.";
      dHero = "corporate";
      dHeader = "corporate";
      dFont = "serif";
      if (!detectedFeatures.includes("faq")) detectedFeatures.push("faq");
    }

    // D. DYNAMIC ADJUSTMENTS
    if (p.includes("azul") || p.includes("indigo")) detectedPalette = "indigo-purple";
    if (p.includes("verde") || p.includes("esmeralda")) detectedPalette = "emerald-dark";
    if (p.includes("dourado") || p.includes("preto")) detectedPalette = "blue-gold";
    if (p.includes("claro") || p.includes("branco")) detectedPalette = "mono-light";

    if (p.includes("arredondado") || p.includes("redondo")) dBorder = "full";
    if (p.includes("quadrado") || p.includes("reto")) dBorder = "none";
    if (p.includes("serif")) dFont = "serif";
    if (p.includes("mono")) dFont = "mono";

    // E. WIDGET FEATURES
    if (p.includes("whatsapp")) {
      if (!detectedFeatures.includes("whatsapp")) detectedFeatures.push("whatsapp");
    }
    if (p.includes("galeria")) {
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    }
    if (p.includes("faq")) {
      if (!detectedFeatures.includes("faq")) detectedFeatures.push("faq");
    }

    // Brand name matching
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
      hero: dHero,
      header: dHeader,
      card: dCard,
      cta: dCta,
      footer: dFooter,
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
      "❯ Escolhendo variantes de header e hero...",
      "❯ Re-calculando margens e espaçamento do Design System...",
      "❯ Redigindo textos com IA...",
      "❯ Sincronizando com a BD do Supabase..."
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
      const parsed = interpretUserPrompt(text);
      
      setBrandName(parsed.name);
      setCategory(parsed.category);
      setDescription(parsed.description);
      setPalette(parsed.palette);
      setFeatures(parsed.features);

      // Apply Layout v4.0 design updates
      setHeroVariant(parsed.hero);
      setHeaderVariant(parsed.header);
      setCardVariant(parsed.card);
      setCtaVariant(parsed.cta);
      setFooterVariant(parsed.footer);
      setBorderRadius(parsed.border);
      setFontFamily(parsed.font);
      setShadowStyle(parsed.shadow);
      setSpacingScale(parsed.spacing);

      setIsCompleted(true);

      // Serialize Design System variables inside the palette field
      const serializedPalette = `${parsed.palette}:${parsed.hero}:${parsed.card}:${parsed.border}:${parsed.font}:${parsed.shadow}:${parsed.header}:${parsed.cta}:${parsed.footer}:${parsed.spacing}`;

      const slug = parsed.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const randomHash = Math.random().toString(36).substring(2, 6);
      const websiteUrl = editId 
        ? `${slug}.mdsites.app`
        : `${slug || "site"}-${randomHash}.mdsites.app`;

      const payload = {
        name: parsed.name,
        category: parsed.category,
        description: parsed.description,
        palette: serializedPalette,
        features: parsed.features,
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
        "Mudar para estilo Stripe moderno",
        "Gerar outra alternativa visual"
      ];

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `Construí um Design System dinâmico de alta fidelidade para **${parsed.name}**!\n\nJustificativa UX/UI:\nComo solicitou um estilo focado em *${text.substring(0, 30)}*, ativei o layout de Hero *${parsed.hero}*, botões em formato *${parsed.cta}*, com o espaçamento *${parsed.spacing}* e cantos *${parsed.border}*.\n\n✓ Layout de Hero: **${parsed.hero}**\n✓ Fontes: **${parsed.font}**\n✓ Spacing: **${parsed.spacing}**\n✓ Botões CTA: **${parsed.cta}**\n\nQue refinamento gostaria de fazer na estrutura do site?`,
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

  // Helper variables mappings for preview styles
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
      
      {/* Background decoration */}
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
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">AI Designer Studio v4.0</span>
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
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
              Diretor de UI/UX Ativo
            </span>
            <button 
              onClick={handleGenerateOtherIdea}
              className="text-[10px] font-bold text-brand-gold hover:text-white bg-brand-gold/15 hover:bg-brand-gold/25 px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 border border-brand-gold/25"
            >
              <Shuffle className="w-3.5 h-3.5" /> ✨ Outra Ideia
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
                    <span className="font-bold text-white">O Copilot está a projetar...</span>
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
                placeholder="Ex: 'Cria um design minimalista estilo Apple'"
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
          
          {/* Browser Toolbar */}
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

          {/* Browser Area */}
          <div className="flex-1 overflow-hidden p-6 flex justify-center items-start bg-slate-900/10">
            <div className={`h-full border border-slate-800 bg-black/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[680px]" : "w-[360px]"
            }`}>
              
              {/* Dynamic Live website page */}
              <div className={`h-full overflow-y-auto relative transition-all duration-500 ${previewTheme.bg} ${
                isLight ? "text-slate-850" : "text-slate-350"
              } ${getFontFamilyClass()}`}>
                
                {/* DYNAMIC HEADER VARIANT */}
                {headerVariant === "center" ? (
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
                ) : headerVariant === "split" ? (
                  <div className={`flex items-center justify-between p-6 border-b ${isLight ? "border-slate-200/60 bg-white/70" : "border-white/5 bg-[#030712]/30"}`}>
                    <div className={`font-bold text-lg flex items-center gap-1.5 font-display select-none ${isLight ? "text-slate-900" : "text-white"}`}>
                      {brandName}
                    </div>
                    <div className="flex items-center gap-6 text-xs font-semibold select-none">
                      <span className="hover:text-white cursor-pointer transition-colors">Início</span>
                      {features.includes("servicos") && <span className="hover:text-white cursor-pointer transition-colors">Serviços</span>}
                    </div>
                    <button className={`px-4 py-2 text-[10px] font-bold ${getBorderRadiusClass()} ${previewTheme.btnAccent}`}>
                      Aceder App ➔
                    </button>
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
                    <h1 className={`text-3.5xl font-light tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
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
                ) : heroVariant === "saas" ? (
                  <div className="py-20 px-8 text-center space-y-6 max-w-4xl mx-auto">
                    <h1 className={`text-4xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                      {previewContent.heroTitle}
                    </h1>
                    <p className="text-xs leading-relaxed max-w-md mx-auto">
                      {previewContent.heroSubtitle}
                    </p>
                    <div className="flex justify-center gap-3">
                      <button className={`px-5 py-2.5 ${getBorderRadiusClass()} text-xs font-bold ${previewTheme.btnAccent}`}>
                        Experimentar Grátis
                      </button>
                    </div>
                    {/* Mockup Dashboard Preview */}
                    <div className={`mt-8 w-full max-w-2xl h-44 rounded-xl border border-slate-800 bg-[#070b16] p-3 shadow-2xl flex flex-col justify-start mx-auto`}>
                      <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex-1 flex items-center justify-center text-[10px] text-slate-650 italic">
                        Visualização do Painel Administrativo SaaS
                      </div>
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
                        Reservar Mesa
                      </button>
                    </div>
                    <div className={`aspect-square rounded-2xl flex items-center justify-center border text-[11px] font-semibold italic ${previewTheme.card} ${getShadowClass()}`}>
                      Foto do Prato
                    </div>
                  </div>
                ) : (
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
                        Fale Connosco
                      </button>
                    </div>
                  </div>
                )}

                {/* SERVICES SECTION */}
                {features.includes("servicos") && (
                  <div className={`${getSpacingClass()} px-8 border-t border-white/5 max-w-4xl mx-auto`}>
                    <div className="text-center space-y-1.5">
                      <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Nossos Serviços</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Soluções feitas para si</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {previewContent.services.map((srv, idx) => (
                        <div 
                          key={idx} 
                          className={`p-5 flex flex-col justify-between h-[150px] transition-all ${getBorderRadiusClass()} ${
                            cardVariant === "minimal" ? "border-slate-800 bg-transparent text-left" :
                            cardVariant === "elevated" ? "bg-slate-900 border border-slate-800 shadow-md hover:scale-[1.02]" :
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
                  <div className={`${getSpacingClass()} px-8 border-t border-white/5 max-w-4xl mx-auto`}>
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
                  <div className={`${getSpacingClass()} px-8 border-t border-white/5 max-w-3xl mx-auto`}>
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
                  <div className={`${getSpacingClass()} px-8 border-t border-white/5 max-w-3xl mx-auto`}>
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

                {/* Footer dynamic variants */}
                {footerVariant === "newsletter" ? (
                  <div className={`p-8 border-t space-y-4 text-center ${isLight ? "border-slate-200/60 bg-slate-100" : "border-white/5 bg-slate-950"}`}>
                    <span className="text-[10px] uppercase font-bold text-brand-gold">Subscreva a nossa newsletter</span>
                    <div className="flex max-w-xs mx-auto gap-1">
                      <input type="email" placeholder="O seu email" className="bg-black/20 border border-white/10 rounded-lg p-2 text-[10px] flex-1 focus:outline-none" />
                      <button className={`px-3 text-[10px] font-bold rounded-lg ${previewTheme.btnAccent}`}>Ok</button>
                    </div>
                    <div className="text-[9px] text-slate-500">
                      &copy; {new Date().getFullYear()} {brandName}. MD Sites AI Designer.
                    </div>
                  </div>
                ) : (
                  <div className={`p-8 border-t text-center text-[10px] text-slate-500 select-none ${
                    isLight ? "border-slate-200/60" : "border-white/5"
                  }`} suppressHydrationWarning>
                    &copy; {new Date().getFullYear()} {brandName}. Desenvolvido com IA da MD Sites.
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
