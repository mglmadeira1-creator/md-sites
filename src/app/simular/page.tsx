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
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome Message from AI Copilot
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Olá! Sou o AI Copilot da MD Sites. 🤖\n\nDescreve simplesmente o website que pretendes criar. Podes escrever um setor, as cores, funcionalidades preferidas, ou apenas uma frase simples. Eu trato de todo o resto!",
        timestamp: new Date(),
        suggestions: [
          "Quero um website para um restaurante italiano moderno.",
          "Cria um website para um consultor de tecnologia.",
          "Quero um site para uma clínica com marcações e WhatsApp.",
          "Cria um portfólio de fotografia minimalista."
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
            setPalette(data.palette);
            setFeatures(data.features);
            setIsCompleted(true);
            setMessages(prev => [
              ...prev,
              {
                sender: "ai",
                text: `Carreguei com sucesso as definições de **${data.name}**. Que modificações ou secções gostarias de aplicar hoje?`,
                timestamp: new Date(),
                suggestions: [
                  "Mudar o tema para verde",
                  "Adicionar secção de FAQ",
                  "Instalar integração WhatsApp"
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

  // Natural Language AI Interpreter
  const interpretUserPrompt = (prompt: string) => {
    const p = prompt.toLowerCase();
    
    // 1. Detect Category / Sector
    let detectedCat = category;
    let detectedDesc = description;
    let detectedName = brandName;
    let detectedPalette = palette;
    let detectedFeatures = [...features];

    if (p.includes("restaurante") || p.includes("pizzaria") || p.includes("italiano") || p.includes("comida") || p.includes("cafe")) {
      detectedCat = "Restaurante & Gastronomia";
      detectedDesc = "Sabores autênticos cozinhados com dedicação e ingredientes frescos da época.";
      if (brandName === "A Minha Marca" || brandName === "A Minha Empresa") {
        detectedName = "Bella Itália";
      }
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    } 
    else if (p.includes("tecnologia") || p.includes("saas") || p.includes("consultor") || p.includes("finanças") || p.includes("advogado")) {
      detectedCat = "Tecnologia & SaaS";
      detectedDesc = "Soluções de engenharia digital inovadoras e automação de processos inteligentes.";
      if (brandName === "A Minha Marca" || brandName === "A Minha Empresa") {
        detectedName = "TechFlow Soluções";
      }
      detectedPalette = "indigo-purple";
    }
    else if (p.includes("clinica") || p.includes("saude") || p.includes("estetica") || p.includes("spa") || p.includes("bem-estar")) {
      detectedCat = "Saúde & Estética";
      detectedDesc = "Tratamentos dermatológicos personalizados com os melhores padrões de bem-estar.";
      if (brandName === "A Minha Marca" || brandName === "A Minha Empresa") {
        detectedName = "Glow Estética & Spa";
      }
      detectedPalette = "emerald-dark";
    }
    else if (p.includes("fotografo") || p.includes("fotografia") || p.includes("portfolio") || p.includes("artista")) {
      detectedCat = "Fotografia & Design";
      detectedDesc = "Captura de momentos espontâneos e projetos artísticos minimalistas de autor.";
      if (brandName === "A Minha Marca" || brandName === "A Minha Empresa") {
        detectedName = "Luz & Arte Fotografia";
      }
      detectedPalette = "mono-light";
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    }

    // 2. Extract potential brand name in quotes or capitalizing after prefix
    const nameMatch = prompt.match(/chamad[oa]\s+["']?([^"']+)["']?/i) || prompt.match(/nome\s+["']?([^"']+)["']?/i);
    if (nameMatch && nameMatch[1]) {
      detectedName = nameMatch[1].trim();
    }

    // 3. Detect Palettes
    if (p.includes("azul") || p.includes("indigo") || p.includes("purple") || p.includes("roxo")) {
      detectedPalette = "indigo-purple";
    } else if (p.includes("verde") || p.includes("esmeralda") || p.includes("emerald")) {
      detectedPalette = "emerald-dark";
    } else if (p.includes("branco") || p.includes("claro") || p.includes("minimalista") || p.includes("cinza")) {
      detectedPalette = "mono-light";
    } else if (p.includes("dourado") || p.includes("ouro") || p.includes("gold") || p.includes("preto")) {
      detectedPalette = "blue-gold";
    }

    // 4. Detect Features
    if (p.includes("whatsapp")) {
      if (!detectedFeatures.includes("whatsapp")) detectedFeatures.push("whatsapp");
    }
    if (p.includes("galeria") || p.includes("portfolio")) {
      if (!detectedFeatures.includes("galeria")) detectedFeatures.push("galeria");
    }
    if (p.includes("faq") || p.includes("perguntas")) {
      if (!detectedFeatures.includes("faq")) detectedFeatures.push("faq");
    }
    if (p.includes("testemunho") || p.includes("depoimento") || p.includes("clientes")) {
      if (!detectedFeatures.includes("depoimentos")) detectedFeatures.push("depoimentos");
    }
    if (p.includes("contacto") || p.includes("formulario")) {
      if (!detectedFeatures.includes("contactos")) detectedFeatures.push("contactos");
    }

    // Remove features
    if (p.includes("remove") || p.includes("tira") || p.includes("apaga")) {
      if (p.includes("whatsapp")) detectedFeatures = detectedFeatures.filter(f => f !== "whatsapp");
      if (p.includes("galeria")) detectedFeatures = detectedFeatures.filter(f => f !== "galeria");
      if (p.includes("faq")) detectedFeatures = detectedFeatures.filter(f => f !== "faq");
      if (p.includes("testemunho") || p.includes("depoimentos")) detectedFeatures = detectedFeatures.filter(f => f !== "depoimentos");
    }

    return {
      name: detectedName,
      category: detectedCat,
      description: detectedDesc,
      palette: detectedPalette,
      features: detectedFeatures
    };
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text, timestamp: new Date() }]);
    setInputValue("");
    setAiTyping(true);

    // Dynamic compilation thoughts
    const thoughts = [
      "❯ Analisando linguagem natural...",
      "❯ Detetando sector e intenção...",
      "❯ Estruturando componentes do design...",
      "❯ A atualizar preview em tempo real..."
    ];

    let tIdx = 0;
    const thoughtInterval = setInterval(() => {
      if (tIdx < thoughts.length) {
        setActiveLogs(prev => [...prev, thoughts[tIdx]]);
        tIdx++;
      } else {
        clearInterval(thoughtInterval);
      }
    }, 300);

    // Process and interpret
    setTimeout(async () => {
      const updateData = interpretUserPrompt(text);
      
      setBrandName(updateData.name);
      setCategory(updateData.category);
      setDescription(updateData.description);
      setPalette(updateData.palette);
      setFeatures(updateData.features);
      setIsCompleted(true);

      // Save database row
      const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const randomHash = Math.random().toString(36).substring(2, 6);
      const websiteUrl = editId 
        ? `${slug}.mdsites.app`
        : `${slug || "site"}-${randomHash}.mdsites.app`;

      const payload = {
        name: updateData.name,
        category: updateData.category,
        description: updateData.description,
        palette: updateData.palette,
        features: updateData.features,
        url: websiteUrl,
        status: "Publicado"
      };

      if (editId) {
        await supabase
          .from("websites")
          .update(payload)
          .eq("id", editId);
      } else {
        await supabase
          .from("websites")
          .insert([payload]);
      }

      // Check current active palette color name for recommendations
      const nextSuggestions = [
        updateData.features.includes("whatsapp") ? "Tirar botão do WhatsApp" : "Instalar WhatsApp no site",
        !updateData.features.includes("galeria") ? "Adicionar Galeria de Fotos" : "Remover Galeria",
        updateData.palette === "blue-gold" ? "Mudar tema para Azul Índigo" : "Mudar tema para Dourado Real",
        "Melhorar o SEO com IA"
      ];

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: `Efetuei as alterações com sucesso! Refiz o design e o conteúdo para **${updateData.name}** (${updateData.category}) com o tema **${updateData.palette}**. O que gostaria de alterar a seguir?`,
          timestamp: new Date(),
          suggestions: nextSuggestions
        }
      ]);

      canvasConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });

      setAiTyping(false);
      setActiveLogs([]);
    }, 1600);
  };

  // Creative "Surprise Me" action
  const handleSurpriseMe = () => {
    const creativeIdeas = [
      "Quero um website para uma pizzaria artesanal chamada Forno d'Ouro, com tema vermelho e galeria.",
      "Cria um website de consultoria tecnológica chamado Matrix Tech com cores azul e roxo.",
      "Quero um site para uma clínica de estética chamada Skin Care com tons esmeralda e WhatsApp.",
      "Cria um site elegante para um fotógrafo de casamentos chamado Memórias de Prata."
    ];
    const randomPrompt = creativeIdeas[Math.floor(Math.random() * creativeIdeas.length)];
    handleSend(randomPrompt);
  };

  // Preview styling mapping
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

  // Dynamic template elements
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
      
      {/* Background image base at full size */}
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
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">AI Copilot v2.0</span>
        </div>

        <div className="flex items-center gap-2">
          <Image
            src="/logonovo.png"
            alt="MD Sites Logo"
            width={120}
            height={34}
            className="h-6 w-auto object-contain"
          />
        </div>
      </header>

      {/* Main Two Column Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: AI Copilot Chat */}
        <div className="w-full lg:w-[480px] border-r border-slate-800/80 flex flex-col bg-slate-950/40 backdrop-blur-md relative z-20 flex-shrink-0">
          
          {/* Active site header */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              Sessão AI Copilot Ativa
            </span>
            <button 
              onClick={handleSurpriseMe}
              className="text-[10px] font-bold text-brand-gold hover:text-white bg-brand-gold/15 hover:bg-brand-gold/25 px-2.5 py-1 rounded-md transition-all flex items-center gap-1"
            >
              ✨ Surpreende-me
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-semibold rounded-tr-none" 
                    : "bg-slate-900 border border-slate-800 text-slate-250 rounded-tl-none space-y-3"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {/* Suggestions bubbles inside message card */}
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

            {/* AI thinking state log */}
            {aiTyping && (
              <div className="flex flex-col items-start space-y-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-350 space-y-2.5 rounded-tl-none w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                    <span className="font-bold text-white">Copilot está a trabalhar...</span>
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
                placeholder="Ex: 'Muda a paleta para verde e adiciona WhatsApp'"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/30"
              />
              <button
                type="submit"
                disabled={aiTyping || !inputValue.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark transition-all disabled:opacity-40 disabled:hover:from-brand-gold flex items-center justify-center"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Real-time Live Preview Browser */}
        <div className="hidden lg:flex flex-1 flex-col bg-slate-950/30 overflow-hidden relative">
          
          {/* Browser address bar / controllers */}
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

            {/* Viewport size switcher */}
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

          {/* Browser Screen area */}
          <div className="flex-1 overflow-hidden p-6 flex justify-center items-start bg-slate-900/10">
            <div className={`h-full border border-slate-800 bg-black/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[680px]" : "w-[360px]"
            }`}>
              
              {/* Dynamic Live website page */}
              <div className={`h-full overflow-y-auto font-sans relative transition-all duration-500 ${previewTheme.bg} ${
                isLight ? "text-slate-850" : "text-slate-350"
              }`}>
                
                {/* Website Header */}
                <div className={`flex items-center justify-between p-6 border-b ${
                  isLight ? "border-slate-200/60 bg-white/70" : "border-white/5 bg-[#030712]/30"
                }`}>
                  <div className={`font-bold text-lg flex items-center gap-1.5 font-display select-none ${isLight ? "text-slate-900" : "text-white"}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
                    {brandName}
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs font-semibold select-none">
                    <span className="hover:text-white cursor-pointer transition-colors">Início</span>
                    {features.includes("servicos") && <span className="hover:text-white cursor-pointer transition-colors">Serviços</span>}
                    {features.includes("galeria") && <span className="hover:text-white cursor-pointer transition-colors">Galeria</span>}
                    {features.includes("depoimentos") && <span className="hover:text-white cursor-pointer transition-colors">Clientes</span>}
                    {features.includes("faq") && <span className="hover:text-white cursor-pointer transition-colors">Perguntas</span>}
                  </div>
                </div>

                {/* Hero block */}
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
                    <button className={`px-5 py-2.5 rounded-xl text-xs font-bold ${previewTheme.btnAccent}`}>
                      Conhecer Serviços
                    </button>
                    <button className={`px-5 py-2.5 rounded-xl text-xs font-bold border ${previewTheme.btnOutline}`}>
                      Fale Connosco
                    </button>
                  </div>
                </div>

                {/* Services layout section */}
                {features.includes("servicos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-1.5">
                      <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Nossos Serviços</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Soluções feitas para si</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {previewContent.services.map((srv, idx) => (
                        <div key={idx} className={`p-4.5 rounded-2xl border flex flex-col justify-between h-[150px] ${previewTheme.card}`}>
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

                {/* Gallery layout section */}
                {features.includes("galeria") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-1.5">
                      <h3 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Portfólio / Galeria</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nosso trabalho recente</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`aspect-video rounded-lg flex items-center justify-center text-[10px] border ${previewTheme.card}`}>
                          Imagem {i}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonials layout section */}
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
                        <div key={idx} className={`p-4 rounded-xl border space-y-2.5 ${previewTheme.card}`}>
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

                {/* FAQ layout section */}
                {features.includes("faq") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-3xl mx-auto space-y-6">
                    <h2 className="text-xl font-bold text-white text-center mb-6">Perguntas Frequentes</h2>
                    <div className="space-y-3">
                      {[
                        { q: "Quais são os vossos prazos de entrega?", a: "Dependendo da dimensão do projeto, tipicamente realizamos a entrega final num prazo de 3 a 7 dias úteis." },
                        { q: "Posso solicitar alterações após a publicação?", a: "Sim, suportamos facilidade de alteração e modificações continuas a qualquer momento." }
                      ].map((faq, fi) => (
                        <div key={fi} className={`p-4 rounded-xl border ${previewTheme.card}`}>
                          <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"} mb-1.5`}>{faq.q}</h4>
                          <p className="text-[10px] text-slate-450 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact layout section */}
                {features.includes("contactos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-md mx-auto space-y-6">
                    <h2 className={`text-xl font-bold text-center ${isLight ? "text-slate-900" : "text-white"}`}>Contacte-nos</h2>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Nome"
                        className={`w-full bg-black/10 border rounded-lg p-2.5 text-xs focus:outline-none ${
                          isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
                        }`}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className={`w-full bg-black/10 border rounded-lg p-2.5 text-xs focus:outline-none ${
                          isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
                        }`}
                      />
                      <textarea
                        rows={3}
                        placeholder="Mensagem..."
                        className={`w-full bg-black/10 border rounded-lg p-2.5 text-xs focus:outline-none resize-none ${
                          isLight ? "border-slate-300 text-slate-800" : "border-white/10 text-white"
                        }`}
                      />
                      <button className={`w-full py-2.5 rounded-lg text-xs font-bold ${previewTheme.btnAccent}`}>
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
