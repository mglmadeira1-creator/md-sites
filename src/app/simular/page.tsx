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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import canvasConfetti from "canvas-confetti";

interface Message {
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  statusLogs?: string[];
  options?: { id: string; label: string; value: any }[];
}

export default function RedesignedSimulator() {
  const router = useRouter();
  
  // Navigation sidebar items representing AI progress
  const [stages, setStages] = useState([
    { id: "marca", name: "Marca", status: "current" },
    { id: "negocio", name: "Área de Negócio", status: "upcoming" },
    { id: "objetivos", name: "Descrição", status: "upcoming" },
    { id: "estilo", name: "Estilo & Cores", status: "upcoming" },
    { id: "funcionalidades", name: "Secções", status: "upcoming" },
    { id: "seo", name: "SEO Automático", status: "upcoming" },
    { id: "website", name: "Website Criado", status: "upcoming" }
  ]);

  // Messages flow
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [aiTyping, setAiTyping] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  
  // Simulator preview data
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [brandName, setBrandName] = useState("A Minha Empresa");
  const [category, setCategory] = useState("Serviços Profissionais");
  const [description, setDescription] = useState("Descreve aqui o teu negócio e veja a IA criar os textos.");
  const [palette, setPalette] = useState("blue-gold");
  const [features, setFeatures] = useState<string[]>(["servicos", "contactos"]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load website data if editing
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
            setStages(prev => prev.map(s => ({ ...s, status: "completed" })));
          }
        };
        fetchWebsite();
      }
    }
  }, []);

  // Initial welcome message from AI
  useEffect(() => {
    setAiTyping(true);
    const timer = setTimeout(() => {
      setMessages([
        {
          sender: "ai",
          text: "Olá! Sou o assistente de inteligência artificial da MD Sites. Vou ajudar-te a criar um website profissional em tempo real. Para começarmos, qual é o nome da tua empresa ou marca?",
          timestamp: new Date()
        }
      ]);
      setAiTyping(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const updateStage = (stageId: string, status: "completed" | "current" | "upcoming") => {
    setStages(prev => prev.map(s => {
      if (s.id === stageId) return { ...s, status };
      return s;
    }));
  };

  // Simulated AI thoughts that display in real-time
  const getStepLogs = (step: number) => {
    switch (step) {
      case 0:
        return [
          "✓ A registar nome da marca...",
          "✓ A estruturar cabeçalho...",
          "✓ A definir domínio temporário..."
        ];
      case 1:
        return [
          "✓ A processar ramo de atividade...",
          "✓ A carregar base de dados de templates...",
          "✓ A estruturar secções base..."
        ];
      case 2:
        return [
          "✓ A analisar descrição do negócio com PLN...",
          "✓ A redigir títulos persuasivos...",
          "✓ A otimizar copy de vendas..."
        ];
      case 3:
        return [
          "✓ A carregar palete de cores...",
          "✓ A compilar folha de estilos CSS...",
          "✓ A ajustar contrastes para leitura..."
        ];
      case 4:
        return [
          "✓ A injetar secções interativas...",
          "✓ A gerar formulário de contacto...",
          "✓ A otimizar imagens responsivas..."
        ];
      default:
        return [];
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // 2. Perform AI thought & step update
    setAiTyping(true);
    const logs = getStepLogs(currentStep);
    setActiveLogs(logs);

    setTimeout(() => {
      // Transition step logic
      let nextStepText = "";
      let nextOptions: any[] | undefined = undefined;

      if (currentStep === 0) {
        // Name captured
        setBrandName(text);
        updateStage("marca", "completed");
        updateStage("negocio", "current");
        
        nextStepText = `Excelente! A marca "${text}" foi registada. Em que ramo ou área atua o teu negócio?`;
        nextOptions = [
          { id: "servicos", label: "Serviços Profissionais", value: "Serviços Profissionais" },
          { id: "restaurante", label: "Restaurante / Pastelaria", value: "Restaurante / Cafetaria" },
          { id: "tech", label: "Tecnologia / SaaS", value: "Tecnologia / SaaS" },
          { id: "saude", label: "Estética & Saúde", value: "Estética e Saúde" }
        ];
        setCurrentStep(1);
      } 
      else if (currentStep === 1) {
        // Category captured
        setCategory(text);
        updateStage("negocio", "completed");
        updateStage("objetivos", "current");

        nextStepText = "Perfeito! Agora, descreve de forma curta o que fazes e qual é a tua missão ou público-alvo.";
        setCurrentStep(2);
      } 
      else if (currentStep === 2) {
        // Description captured
        setDescription(text);
        updateStage("objetivos", "completed");
        updateStage("estilo", "current");

        nextStepText = "Excelente. Que estilo e paleta de cores preferes para o teu website?";
        nextOptions = [
          { id: "blue-gold", label: "Azul & Ouro", value: "blue-gold" },
          { id: "emerald", label: "Esmeralda & Escuro", value: "emerald-dark" },
          { id: "indigo", label: "Índigo & Violeta", value: "indigo-purple" },
          { id: "minimalist", label: "Monocromático", value: "minimalist" }
        ];
        setCurrentStep(3);
      } 
      else if (currentStep === 3) {
        // Palette captured
        setPalette(text);
        updateStage("estilo", "completed");
        updateStage("funcionalidades", "current");

        nextStepText = "Ótimo. Seleciona as secções extra que queres adicionar ao layout:";
        nextOptions = [
          { id: "servicos", label: "Serviços & Produtos", value: "servicos" },
          { id: "galeria", label: "Galeria de Fotos", value: "galeria" },
          { id: "depoimentos", label: "Depoimentos", value: "depoimentos" },
          { id: "faq", label: "Perguntas Frequentes", value: "faq" },
          { id: "contactos", label: "Formulário de Contacto", value: "contactos" }
        ];
        setCurrentStep(4);
      } 
      else if (currentStep === 4) {
        // Features captured
        // Compile Website
        updateStage("funcionalidades", "completed");
        updateStage("seo", "completed");
        updateStage("website", "completed");
        setAiTyping(false);
        setActiveLogs([]);

        // Show loading compilation
        setAiTyping(true);
        setTimeout(async () => {
          setAiTyping(false);
          setIsCompleted(true);
          
          const slug = brandName.toLowerCase().replace(/[^a-z0-9]/g, "");
          const randomHash = Math.random().toString(36).substring(2, 6);
          const websiteUrl = editId 
            ? `${slug}.mdsites.app`
            : `${slug || "site"}-${randomHash}.mdsites.app`;
            
          const payload = {
            name: brandName,
            category,
            description,
            palette,
            features,
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

          canvasConfetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#D4AF37", "#3B82F6", "#FFFFFF"]
          });
        }, 1500);
        return;
      }

      setMessages(prev => [...prev, {
        sender: "ai",
        text: nextStepText,
        timestamp: new Date(),
        statusLogs: logs,
        options: nextOptions
      }]);
      setAiTyping(false);
      setActiveLogs([]);
    }, 2000);
  };

  // Preview styling logic
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
          bg: "bg-[#0b0722]",
          card: "bg-[#181145]/80 border-[#8b5cf6]/20",
          textAccent: "text-[#8b5cf6]",
          btnAccent: "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white",
          btnOutline: "border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/10 text-white"
        };
      case "minimalist":
        return {
          bg: "bg-[#09090b]",
          card: "bg-[#18181b]/80 border-white/10",
          textAccent: "text-white",
          btnAccent: "bg-white hover:bg-neutral-200 text-black font-semibold",
          btnOutline: "border-white/20 hover:bg-white/10 text-white"
        };
      case "blue-gold":
      default:
        return {
          bg: "bg-[#030712]",
          card: "bg-[#0d1527]/80 border-[#D4AF37]/20",
          textAccent: "text-[#D4AF37]",
          btnAccent: "bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:shadow-lg text-slate-900 font-bold",
          btnOutline: "border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 text-white"
        };
    }
  };

  const previewTheme = getThemeClasses();

  // Dynamic template elements based on sector
  const getGeneratedContent = () => {
    let heroTitle = `Soluções inteligentes para ${brandName}`;
    let heroSubtitle = description;
    let services = [
      { name: "Consultoria Premium", desc: "Aconselhamento estratégico personalizado para otimizar os seus resultados." },
      { name: "Gestão Integrada", desc: "Tratamos dos processos complexos para que se foque no que realmente importa." },
      { name: "Suporte Dedicado", desc: "A nossa equipa técnica está sempre disponível para assegurar a máxima estabilidade." }
    ];

    if (category.includes("Restaurante") || category.includes("Cafetaria")) {
      heroTitle = `Bem-vindo ao ${brandName}`;
      heroSubtitle = `Uma experiência gastronómica inesquecível. ${description}`;
      services = [
        { name: "Menu de Degustação", desc: "Pratos de autor confecionados com ingredientes frescos e locais." },
        { name: "Eventos Privados", desc: "Espaço sofisticado para celebrar momentos marcantes." },
        { name: "Serviço de Reservas", desc: "Garanta a sua mesa com facilidade e desfrute de um atendimento exclusivo." }
      ];
    } else if (category.includes("Tecnologia") || category.includes("SaaS")) {
      heroTitle = `Acelere o seu negócio com ${brandName}`;
      heroSubtitle = `A tecnologia que simplifica o seu fluxo de trabalho de forma automatizada. ${description}`;
      services = [
        { name: "Automação Avançada", desc: "Elimine tarefas manuais repetitivas e ganhe horas de produtividade diária." },
        { name: "Painel de Métricas", desc: "Dados consolidados em tempo real para tomada de decisões estratégicas." },
        { name: "Segurança de Dados", desc: "Criptografia avançada de ponta a ponta para proteger a sua informação." }
      ];
    } else if (category.includes("Saúde") || category.includes("Estética")) {
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

  const handleOptionClick = (opt: { id: string; label: string; value: any }) => {
    if (currentStep === 4) {
      // Multi-select features step
      if (features.includes(opt.value)) {
        setFeatures(prev => prev.filter(f => f !== opt.value));
      } else {
        setFeatures(prev => [...prev, opt.value]);
      }
    } else {
      // Single select
      handleSend(opt.label);
      if (currentStep === 1) setCategory(opt.value);
      if (currentStep === 3) setPalette(opt.value);
    }
  };

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
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all py-1.5 px-3 rounded-lg bg-white/5 border border-slate-800"
          >
            Sair do Builder
          </button>
          <div className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span>AI Copilot Active</span>
          </div>
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

      {/* Main Container */}
      <div className="flex-1 flex w-full relative z-20 overflow-hidden">
        
        {/* PROGRESS SIDEBAR */}
        <aside className="hidden md:flex flex-col w-56 bg-slate-950/40 border-r border-slate-900 p-5 space-y-4 flex-shrink-0">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Progresso do Site</h4>
          <div className="space-y-1.5">
            {stages.map((stg) => (
              <div 
                key={stg.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  stg.status === "completed" 
                    ? "text-emerald-400 bg-emerald-500/5" 
                    : stg.status === "current"
                    ? "text-brand-gold bg-brand-gold/5 border border-brand-gold/15"
                    : "text-slate-650"
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px] ${
                  stg.status === "completed"
                    ? "bg-emerald-500 border-emerald-500 text-slate-950"
                    : stg.status === "current"
                    ? "border-brand-gold text-brand-gold"
                    : "border-slate-850 text-slate-650"
                }`}>
                  {stg.status === "completed" ? "✓" : ""}
                </div>
                <span>{stg.name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* LEFT COLUMN: CHAT INTERACTION */}
        <div className="w-full md:w-[450px] lg:w-[500px] border-r border-slate-900 flex flex-col justify-between bg-slate-950/40 backdrop-blur-sm relative z-10 flex-shrink-0 h-full">
          
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-4.5 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-semibold shadow-md"
                        : "glass-morphism border border-white/5 text-slate-200"
                    }`}
                  >
                    {/* Bot Sparkle icon */}
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-2.5 select-none">
                        <Sparkles className="w-3.5 h-3.5 fill-brand-gold/15" />
                        MD Sites AI
                      </div>
                    )}
                    {msg.text}
                  </div>

                  {/* Render Quick Choice Option chips inside the AI messages flow */}
                  {msg.sender === "ai" && msg.options && (
                    <div className="flex flex-wrap gap-2 mt-3.5 max-w-[95%]">
                      {msg.options.map((opt) => {
                        const isSelected = currentStep === 4 && features.includes(opt.value);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                              isSelected
                                ? "bg-brand-gold text-brand-blue-dark border-brand-gold font-bold shadow-md shadow-brand-gold/10"
                                : "bg-white/5 border-slate-800/80 text-slate-350 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {opt.label}
                            {isSelected && " ✓"}
                          </button>
                        );
                      })}
                      {currentStep === 4 && msg.options && (
                        <button
                          onClick={() => handleSend("Concluir secções")}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all border border-emerald-500 flex items-center gap-1 shadow-md shadow-emerald-500/10"
                        >
                          Confirmar Secções
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Render compilation status logs inside active message block */}
                  {msg.statusLogs && index === messages.length - 2 && (
                    <div className="mt-3.5 p-3 rounded-xl border border-slate-850/80 bg-[#030712] font-mono text-[11px] text-brand-gold space-y-1.5 w-[90%]">
                      {msg.statusLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-emerald-400">✓</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {aiTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start"
                >
                  <div className="glass-morphism border border-white/5 rounded-2xl p-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce" />
                  </div>
                  
                  {activeLogs.length > 0 && (
                    <div className="mt-3.5 p-3 rounded-xl border border-slate-850/80 bg-[#030712] font-mono text-[11px] text-brand-gold space-y-1.5 w-[280px]">
                      {activeLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-1.5 items-start">
                          <span className="text-brand-gold animate-spin">⟳</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* User Text Input Block */}
          <div className="p-4 border-t border-slate-900 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-brand-blue-dark border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-brand-gold/50 transition-all"
            >
              <input
                type="text"
                placeholder={aiTyping ? "Aguarde pela IA..." : "Escreva uma resposta..."}
                disabled={aiTyping || isCompleted}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={aiTyping || isCompleted || !inputValue.trim()}
                className="p-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark hover:scale-105 transition-all disabled:opacity-30 disabled:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: DYNAMIC PREVIEW IN BROWSER FRAME */}
        <div className="flex-1 p-6 flex flex-col justify-start items-center overflow-hidden h-full">
          
          {/* Sizing & Sizing bar */}
          <div className="w-full max-w-5xl flex items-center justify-between mb-4 flex-shrink-0">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              Live Preview
            </span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1.5">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded-md transition-all ${previewMode === "desktop" ? "bg-brand-gold text-brand-blue-dark" : "text-slate-400 hover:text-white"}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode("tablet")}
                className={`p-1.5 rounded-md transition-all ${previewMode === "tablet" ? "bg-brand-gold text-brand-blue-dark" : "text-slate-400 hover:text-white"}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded-md transition-all ${previewMode === "mobile" ? "bg-brand-gold text-brand-blue-dark" : "text-slate-400 hover:text-white"}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Container Card */}
          <div className="flex-1 w-full max-w-5xl overflow-hidden relative flex justify-center items-start">
            
            <div 
              className={`border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col bg-slate-900 h-full relative ${
                previewMode === "desktop" ? "w-full" :
                previewMode === "tablet" ? "w-[768px]" : "w-[365px]"
              }`}
            >
              {/* Browser Header Bar */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-900/80 flex items-center justify-between text-xs text-slate-500 font-mono flex-shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="bg-slate-900 border border-slate-800/80 px-10 py-1.5 rounded-md text-slate-450 flex items-center gap-1 select-all">
                  <Globe className="w-3 h-3 text-slate-500" />
                  https://{brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.mdsites.app
                </div>
                <div className="w-10" />
              </div>

              {/* Dynamic Live website page */}
              <div className={`flex-1 overflow-y-auto font-sans text-slate-300 relative transition-all duration-500 ${previewTheme.bg}`}>
                
                {/* Website Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div className="font-bold text-white text-lg flex items-center gap-1.5 font-display select-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse" />
                    {brandName}
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-450 select-none">
                    <span className="hover:text-white cursor-pointer transition-colors">Início</span>
                    {features.includes("servicos") && <span className="hover:text-white cursor-pointer transition-colors">Serviços</span>}
                    {features.includes("galeria") && <span className="hover:text-white cursor-pointer transition-colors">Galeria</span>}
                    {features.includes("depoimentos") && <span className="hover:text-white cursor-pointer transition-colors">Clientes</span>}
                    {features.includes("faq") && <span className="hover:text-white cursor-pointer transition-colors">Perguntas</span>}
                  </div>
                  <div>
                    <button className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${previewTheme.btnAccent}`}>
                      Falar Connosco
                    </button>
                  </div>
                </div>

                {/* Website Hero */}
                <div className="py-20 px-8 text-center max-w-4xl mx-auto space-y-6">
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-400 select-none">
                    {category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight">
                    {previewContent.heroTitle}
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    {previewContent.heroSubtitle}
                  </p>
                  <div className="flex justify-center gap-4 pt-2">
                    <button className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${previewTheme.btnAccent}`}>
                      Conhecer Mais
                    </button>
                    <button className={`px-6 py-2.5 rounded-lg text-xs font-semibold border transition-all ${previewTheme.btnOutline}`}>
                      Nossos Planos
                    </button>
                  </div>
                </div>

                {/* Services layout section */}
                {features.includes("servicos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-10">O que Fazemos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {previewContent.services.map((serv, index) => (
                        <div key={index} className={`p-6 rounded-xl border ${previewTheme.card} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                          <h3 className="font-bold text-white mb-2">{serv.name}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">{serv.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery layout section */}
                {features.includes("galeria") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-10">Galeria de Imagens</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`aspect-video rounded-xl border flex items-center justify-center ${previewTheme.card} relative overflow-hidden group`}>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                            <span className="text-[10px] text-slate-450 font-semibold uppercase">Foto Destaque {i}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonials layout section */}
                {features.includes("depoimentos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-2xl font-bold text-white">Opiniões de Clientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`p-6 rounded-xl border text-left ${previewTheme.card}`}>
                        <p className="text-xs italic text-slate-350">
                          &quot;O serviço superou todas as expetativas. Muito profissional, rápido e de alta qualidade. Recomendo vivamente a qualquer empresa!&quot;
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                            CM
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Carlos Martins</span>
                            <span className="text-[10px] text-slate-500">Diretor de Operações</span>
                          </div>
                        </div>
                      </div>
                      <div className={`p-6 rounded-xl border text-left ${previewTheme.card}`}>
                        <p className="text-xs italic text-slate-355 text-slate-300">
                          &quot;Trabalhar com esta equipa mudou completamente o nosso ritmo. O suporte é fantástico e o produto final excelente.&quot;
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                            AF
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Ana Ferreira</span>
                            <span className="text-[10px] text-slate-500">CEO & Fundadora</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FAQ section */}
                {features.includes("faq") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-3xl mx-auto space-y-6">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                      {[
                        { q: "Quais são os vossos prazos de entrega?", a: "Dependendo da dimensão do projeto, tipicamente realizamos a entrega final num prazo de 3 a 7 dias úteis." },
                        { q: "Posso solicitar alterações após a publicação?", a: "Sim, os nossos planos Pro e Agência incluem suporte permanente e facilidade de alteração a qualquer momento." }
                      ].map((faq, fi) => (
                        <div key={fi} className={`p-4 rounded-xl border ${previewTheme.card}`}>
                          <h4 className="text-xs font-bold text-white mb-2">{faq.q}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact layout section */}
                {features.includes("contactos") && (
                  <div className="py-16 px-8 border-t border-white/5 max-w-md mx-auto space-y-6">
                    <h2 className="text-2xl font-bold text-white text-center">Contacte-nos</h2>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Nome"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-gold/50"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-gold/50"
                      />
                      <textarea
                        rows={3}
                        placeholder="Mensagem..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-gold/50 resize-none"
                      />
                      <button className={`w-full py-2.5 rounded-lg text-xs font-bold ${previewTheme.btnAccent}`}>
                        Enviar Mensagem
                      </button>
                    </form>
                  </div>
                )}

                {/* Footer */}
                <div className="p-8 border-t border-white/5 text-center text-[10px] text-slate-500 select-none" suppressHydrationWarning>
                  &copy; {new Date().getFullYear()} {brandName}. Desenvolvido com IA da MD Sites.
                </div>

              </div>

              {/* SUCCESS / COMPLETION PANEL OVERLAY */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#030712]/95 backdrop-blur-lg z-30 flex flex-col items-center justify-center p-8 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-gold/20 to-brand-gold-dark/10 border border-brand-gold/30 rounded-full flex items-center justify-center shadow-lg shadow-brand-gold/10">
                      <Sparkles className="w-10 h-10 text-brand-gold animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">🎉 Website Criado com Sucesso!</h2>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        A Inteligência Artificial da MD Sites concluiu a geração da estrutura, do design responsivo e das otimizações SEO.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm pt-4">
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="px-5 py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-sm rounded-xl shadow-lg transition-all"
                      >
                        Entrar no Dashboard
                      </button>
                      <button
                        onClick={() => router.push("/dashboard/websites")}
                        className="px-5 py-3 border border-slate-800 bg-white/5 hover:bg-white/10 hover:border-brand-gold/20 text-xs font-semibold text-slate-350 hover:text-white rounded-xl transition-all"
                      >
                        Publicar Website
                      </button>
                      <button
                        onClick={() => {
                          setIsCompleted(false);
                          setCurrentStep(0);
                          setMessages([
                            {
                              sender: "ai",
                              text: "Olá! Vamos gerar outra versão juntos. Qual é o nome do novo negócio ou marca?",
                              timestamp: new Date()
                            }
                          ]);
                          setStages(stages.map(s => ({ ...s, status: s.id === "marca" ? "current" : "upcoming" })));
                        }}
                        className="px-5 py-3 border border-slate-800 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-350 hover:text-white rounded-xl transition-all sm:col-span-2"
                      >
                        Gerar Outra Versão
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
