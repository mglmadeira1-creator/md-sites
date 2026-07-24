"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Globe, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  LineChart, 
  Mail, 
  Star, 
  MapPin, 
  Cpu, 
  Shield, 
  ShoppingCart, 
  Zap, 
  ChevronLeft, 
  Check, 
  Trash2, 
  Settings, 
  RefreshCw,
  Plus,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Website {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
}

interface InstalledApp {
  app_id: string;
  config: any;
  is_enabled: boolean;
}

interface AppDefinition {
  id: string;
  name: string;
  desc: string;
  category: string;
  icon: any;
  isPremium: boolean;
  fields: { name: string; label: string; type: "text" | "password" | "checkbox" | "select"; options?: string[]; default?: any }[];
}

export default function MarketplacePage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebId, setSelectedWebId] = useState<string>("");
  const [loadingWebs, setLoadingWebs] = useState(true);
  
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [activeTab, setActiveTab] = useState<"marketplace" | "installed" | "automations">("marketplace");
  const [activeConfigApp, setActiveConfigApp] = useState<AppDefinition | null>(null);
  
  // States for interactive configure form
  const [configFormValues, setConfigFormValues] = useState<any>({});
  const [savingConfig, setSavingConfig] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Automation Flow Builder States
  const [automationSteps, setAutomationSteps] = useState<string[]>([
    "Formulário preenchido no Website",
    "Guardar contacto no Leads Hub"
  ]);
  const [addingStep, setAddingStep] = useState(false);

  // App definitions matching user requirements
  const apps: AppDefinition[] = [
    // 1. Comunicação
    {
      id: "whatsapp",
      name: "WhatsApp Chat Widget",
      desc: "Adicione um botão flutuante de chat direto para falar com os clientes instantaneamente.",
      category: "Comunicação",
      icon: MessageSquare,
      isPremium: false,
      fields: [
        { name: "phone", label: "Número de Telefone (com indicativo)", type: "text", default: "+351912345678" },
        { name: "message", label: "Mensagem Inicial Automática", type: "text", default: "Olá! Gostaria de obter mais informações." },
        { name: "show_desktop", label: "Mostrar no Computador", type: "checkbox", default: true },
        { name: "show_mobile", label: "Mostrar no Telemóvel", type: "checkbox", default: true },
        { name: "position", label: "Posição do Widget", type: "select", options: ["Direita", "Esquerda"], default: "Direita" }
      ]
    },
    {
      id: "crisp",
      name: "Crisp Live Chat",
      desc: "Integre uma consola profissional de apoio ao cliente e chat ao vivo no site.",
      category: "Comunicação",
      icon: MessageSquare,
      isPremium: true,
      fields: [
        { name: "website_id", label: "Crisp Website ID (UUID)", type: "text" }
      ]
    },
    // 2. Reservas
    {
      id: "calendly",
      name: "Calendly Integration",
      desc: "Permita que os clientes agendem reuniões e consultas diretamente no site.",
      category: "Reservas",
      icon: Calendar,
      isPremium: false,
      fields: [
        { name: "url", label: "URL Pública do Calendly", type: "text", default: "https://calendly.com/o-teu-link" }
      ]
    },
    // 3. Pagamentos
    {
      id: "stripe",
      name: "Stripe Checkout",
      desc: "Aceite cartões de crédito/débito com o gateway de pagamentos mais seguro do mundo.",
      category: "Pagamentos",
      icon: CreditCard,
      isPremium: true,
      fields: [
        { name: "public_key", label: "Stripe Publishable Key", type: "text" },
        { name: "secret_key", label: "Stripe Secret Key", type: "password" },
        { name: "test_mode", label: "Modo Teste / Sandbox", type: "checkbox", default: true }
      ]
    },
    // 4. Analytics
    {
      id: "google_analytics",
      name: "Google Analytics 4",
      desc: "Acompanhe métricas, acessos, conversões e comportamento dos visitantes.",
      category: "Analytics",
      icon: LineChart,
      isPremium: false,
      fields: [
        { name: "measurement_id", label: "Google Measurement ID (G-XXXXXXX)", type: "text" }
      ]
    },
    // 5. Email Marketing
    {
      id: "mailchimp",
      name: "Mailchimp Newsletter",
      desc: "Sincronize contactos de formulários diretamente com listas de email marketing.",
      category: "Email",
      icon: Mail,
      isPremium: false,
      fields: [
        { name: "api_key", label: "Mailchimp API Key", type: "password" },
        { name: "list_id", label: "Mailchimp Audience/List ID", type: "text" }
      ]
    },
    // 6. Avaliações
    {
      id: "google_reviews",
      name: "Google Reviews Widget",
      desc: "Exiba as melhores avaliações do seu negócio no Google no corpo do website.",
      category: "Avaliações",
      icon: Star,
      isPremium: true,
      fields: [
        { name: "place_id", label: "Google Place ID", type: "text" }
      ]
    },
    // 7. Mapas
    {
      id: "google_maps",
      name: "Google Maps Embed",
      desc: "Adicione mapas com rotas e localizadores das lojas físicas do seu negócio.",
      category: "Mapas",
      icon: MapPin,
      isPremium: false,
      fields: [
        { name: "address", label: "Endereço Completo", type: "text", default: "Lisboa, Portugal" },
        { name: "zoom", label: "Nível de Zoom (1 a 20)", type: "text", default: "14" },
        { name: "show_marker", label: "Adicionar Marcador de Local", type: "checkbox", default: true }
      ]
    },
    // 8. CRM
    {
      id: "hubspot",
      name: "HubSpot CRM Sync",
      desc: "Transfira leads de contactos do site diretamente para o pipeline do HubSpot.",
      category: "CRM",
      icon: Cpu,
      isPremium: true,
      fields: [
        { name: "api_key", label: "HubSpot Access Token / API Key", type: "password" }
      ]
    },
    // 9. Segurança
    {
      id: "recaptcha",
      name: "Google reCAPTCHA v3",
      desc: "Proteja os formulários do site contra spam, bots e mensagens falsas.",
      category: "Segurança",
      icon: Shield,
      isPremium: false,
      fields: [
        { name: "site_key", label: "Google Site Key", type: "text" }
      ]
    },
    // 10. E-commerce
    {
      id: "cart_recovery",
      name: "Recuperação de Carrinho",
      desc: "Envie emails automáticos aos clientes que abandonam o checkout antes de concluir.",
      category: "E-commerce",
      icon: ShoppingCart,
      isPremium: true,
      fields: [
        { name: "delay_hours", label: "Tempo de espera para email (horas)", type: "text", default: "2" }
      ]
    }
  ];

  // Load user websites
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
          }
        }
      } catch (err) {
        console.error("Erro ao carregar sites no Marketplace:", err);
      } finally {
        setLoadingWebs(false);
      }
    };
    fetchWebsites();
  }, []);

  // Fetch installed apps for selected website
  const fetchInstalledApps = async (webId: string) => {
    if (!webId) return;
    setLoadingApps(true);
    try {
      const { data, error } = await supabase
        .from("installed_apps")
        .select("app_id, config, is_enabled")
        .eq("website_id", webId);
      if (!error && data) {
        setInstalledApps(data as InstalledApp[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (selectedWebId) {
      fetchInstalledApps(selectedWebId);
    }
  }, [selectedWebId]);

  // Handle Install & Configure action
  const handleSaveConfig = async () => {
    if (!selectedWebId || !activeConfigApp) return;
    setSavingConfig(true);
    try {
      const { error } = await supabase
        .from("installed_apps")
        .upsert({
          website_id: selectedWebId,
          app_id: activeConfigApp.id,
          config: configFormValues,
          is_enabled: true
        }, { onConflict: "website_id,app_id" });

      if (!error) {
        setSuccessMsg(`Sucesso! A aplicação "${activeConfigApp.name}" foi configurada com sucesso.`);
        fetchInstalledApps(selectedWebId);
        setActiveConfigApp(null);
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingConfig(false);
    }
  };

  // Handle Uninstall action
  const handleUninstall = async (appId: string) => {
    if (!selectedWebId) return;
    if (confirm("Deseja desinstalar esta aplicação? As configurações serão apagadas.")) {
      try {
        const { error } = await supabase
          .from("installed_apps")
          .delete()
          .eq("website_id", selectedWebId)
          .eq("app_id", appId);

        if (!error) {
          setSuccessMsg("Aplicação desinstalada com sucesso.");
          fetchInstalledApps(selectedWebId);
          setTimeout(() => setSuccessMsg(""), 3000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Determine recommendations based on active site category
  const getCategoryRecommendations = () => {
    const activeWeb = websites.find(w => w.id === selectedWebId);
    if (!activeWeb) return [];
    
    const cat = activeWeb.category.toLowerCase();
    if (cat.includes("restaurante") || cat.includes("cafetaria")) {
      return ["whatsapp", "google_maps", "google_reviews", "calendly"];
    } else if (cat.includes("estética") || cat.includes("saúde") || cat.includes("clinica")) {
      return ["calendly", "whatsapp", "google_reviews"];
    } else if (cat.includes("tecnologia") || cat.includes("saas") || cat.includes("loja") || cat.includes("e-commerce")) {
      return ["stripe", "google_analytics", "mailchimp", "cart_recovery"];
    }
    return ["whatsapp", "google_analytics"];
  };

  const recommendedIds = getCategoryRecommendations();

  // Helper to check install state
  const isInstalled = (appId: string) => {
    return installedApps.some(item => item.app_id === appId);
  };

  const getInstalledConfig = (appId: string) => {
    return installedApps.find(item => item.app_id === appId)?.config || {};
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Head indicator and Website selection */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white">Marketplace 🚀</h1>
          <p className="text-slate-400 text-sm mt-1">Ligue ferramentas de pagamentos, chat, agendamentos e analítica ao seu website.</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
          <span className="text-xs text-slate-400 font-semibold select-none">Website Ativo:</span>
          {loadingWebs ? (
            <span className="text-xs text-slate-500">A carregar...</span>
          ) : (
            <select 
              value={selectedWebId} 
              onChange={(e) => setSelectedWebId(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-none border-none cursor-pointer"
            >
              {websites.map(web => (
                <option key={web.id} value={web.id} className="bg-slate-950 text-white">
                  {web.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Tabs controllers */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-[1px]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab("marketplace")} 
            className={`text-xs font-bold uppercase tracking-wider pb-3 transition-colors ${
              activeTab === "marketplace" ? "text-brand-gold border-b-2 border-brand-gold" : "text-slate-400 hover:text-white"
            }`}
          >
            Descobrir Aplicações
          </button>
          <button 
            onClick={() => setActiveTab("installed")} 
            className={`text-xs font-bold uppercase tracking-wider pb-3 transition-colors ${
              activeTab === "installed" ? "text-brand-gold border-b-2 border-brand-gold" : "text-slate-400 hover:text-white"
            }`}
          >
            Instaladas ({installedApps.length})
          </button>
          <button 
            onClick={() => setActiveTab("automations")} 
            className={`text-xs font-bold uppercase tracking-wider pb-3 transition-colors ${
              activeTab === "automations" ? "text-brand-gold border-b-2 border-brand-gold" : "text-slate-400 hover:text-white"
            }`}
          >
            Automações ⚡
          </button>
        </div>
      </div>

      {/* Success Messages alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -8 }} 
            className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB 1: ALL MARKETPLACE APPLICATIONS */}
      {activeTab === "marketplace" && activeConfigApp === null && (
        <div className="space-y-8">
          
          {/* Smart Recommendation Banner based on sector */}
          {websites.length > 0 && recommendedIds.length > 0 && (
            <div 
              className="p-6 rounded-2xl border border-brand-gold/15 bg-gradient-to-r from-brand-gold/5 via-transparent to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{ boxShadow: "0 0 40px -15px rgba(212,175,55,0.15)" }}
            >
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
                  Recomendado para o sector: {websites.find(w => w.id === selectedWebId)?.category}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Detetámos a categoria do seu negócio. Recomendamos que instale os seguintes widgets e integrações para atrair mais clientes.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {apps.filter(app => recommendedIds.includes(app.id) && !isInstalled(app.id)).map(app => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        setActiveConfigApp(app);
                        setConfigFormValues(getInstalledConfig(app.id));
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs flex items-center gap-1.5 hover:shadow-lg transition-all"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      Instalar {app.name.split(" ")[0]}
                    </button>
                  );
                })}
                {apps.filter(app => recommendedIds.includes(app.id) && !isInstalled(app.id)).length === 0 && (
                  <span className="text-xs text-emerald-400 font-semibold border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 rounded-xl">
                    ✓ Tudo Recomendado Instalado
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Standard Apps list grid layout */}
          {loadingApps ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-gold animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => {
                const Icon = app.icon;
                const installed = isInstalled(app.id);
                return (
                  <div 
                    key={app.id} 
                    className="rounded-2xl glass-morphism border border-slate-800/80 p-6 flex flex-col justify-between hover:border-brand-gold/15 transition-all duration-300 h-[210px]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            app.isPremium 
                              ? "bg-amber-500/10 text-brand-gold border-brand-gold/20" 
                              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                          }`}>
                            {app.isPremium ? "Premium" : "Grátis"}
                          </span>
                          {installed && (
                            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Instalada
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{app.name}</h3>
                        <p className="text-[11px] text-slate-450 leading-relaxed mt-1.5">{app.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-850 pt-3 mt-3">
                      {installed ? (
                        <>
                          <button
                            onClick={() => handleUninstall(app.id)}
                            className="p-2 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 rounded-lg text-rose-400 transition-all text-xs"
                            title="Desinstalar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setActiveConfigApp(app);
                              setConfigFormValues(getInstalledConfig(app.id));
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-slate-800 flex items-center gap-1"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            Configurar
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            setActiveConfigApp(app);
                            // Preload defaults
                            const defaults: any = {};
                            app.fields.forEach(f => {
                              if (f.default !== undefined) defaults[f.name] = f.default;
                            });
                            setConfigFormValues(defaults);
                          }}
                          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs hover:shadow-lg transition-all"
                        >
                          Instalar Aplicação
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: INSTALLED APPLICATIONS FILTER */}
      {activeTab === "installed" && activeConfigApp === null && (
        <div className="space-y-6">
          {installedApps.length === 0 ? (
            <div className="rounded-2xl glass-morphism border border-slate-800/80 p-12 text-center space-y-4">
              <p className="text-sm text-slate-400">Ainda não tens nenhuma aplicação ou integração ativa neste website.</p>
              <button 
                onClick={() => setActiveTab("marketplace")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark text-xs font-bold transition-all"
              >
                Explorar Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.filter(app => isInstalled(app.id)).map((app) => {
                const Icon = app.icon;
                return (
                  <div key={app.id} className="rounded-2xl glass-morphism border border-slate-800/80 p-6 flex flex-col justify-between hover:border-brand-gold/15 transition-all duration-300 h-[200px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-brand-gold" />
                        </div>
                        <span className="text-[8px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Instalada
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{app.name}</h3>
                        <p className="text-[11px] text-slate-450 leading-relaxed mt-1.5">{app.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-850 pt-3 mt-3">
                      <button
                        onClick={() => handleUninstall(app.id)}
                        className="p-2 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 rounded-lg text-rose-400 transition-all text-xs"
                      >
                        Desinstalar
                      </button>
                      <button 
                        onClick={() => {
                          setActiveConfigApp(app);
                          setConfigFormValues(getInstalledConfig(app.id));
                        }}
                        className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs"
                      >
                        Configurar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VISUAL AUTOMATIONS (ZAPIER-LIKE SIMULATOR) */}
      {activeTab === "automations" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Visual Automation Pipeline Nodes Canvas */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 flex flex-col justify-start space-y-8 relative overflow-hidden">
            <h3 className="text-sm font-bold text-white">Fluxo de Trabalho Automatizado (Zapier Workflow)</h3>
            
            {/* Visual Steps representation */}
            <div className="flex flex-col items-center space-y-4 relative z-10 w-full">
              {automationSteps.map((stepName, sIdx) => (
                <div key={sIdx} className="flex flex-col items-center w-full max-w-md">
                  <div className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl relative">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold font-bold text-xs flex items-center justify-center">
                        {sIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-250">{stepName}</span>
                    </div>
                    {sIdx > 1 && (
                      <button 
                        onClick={() => setAutomationSteps(prev => prev.filter((_, i) => i !== sIdx))}
                        className="text-rose-400 hover:text-rose-350 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {sIdx < automationSteps.length - 1 && (
                    <div className="w-[2px] h-6 bg-slate-850 flex items-center justify-center my-0.5">
                      <ArrowRight className="w-3 h-3 text-slate-700 rotate-90 transform" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Automation addition node triggers */}
            <div className="flex justify-center pt-2 relative z-10">
              <button 
                onClick={() => setAddingStep(true)}
                className="px-4 py-2 border border-slate-800 hover:border-brand-gold/20 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-350 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-brand-gold" />
                Adicionar Ação de Automação
              </button>
            </div>

            {/* Glow halos decoration */}
            <div className="absolute w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none -z-10" />
          </div>

          {/* Automations side instructions and dynamic selections */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Como funciona o Zapier Integrado?</h4>
              <p className="text-xs text-slate-450 leading-relaxed">
                Configure fluxos automáticos sem programar. Sempre que um evento (gatilho/trigger) acontece no seu website, a plataforma executa de seguida ações coordenadas em todas as suas ferramentas integradas (WhatsApp, HubSpot, Sheets, etc.).
              </p>
            </div>

            {/* Steps creation panel */}
            <AnimatePresence>
              {addingStep && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-2xl border border-slate-800 p-6 bg-slate-950 space-y-4"
                >
                  <h4 className="text-xs font-bold text-white">Escolher Ação Automática</h4>
                  <div className="space-y-2">
                    {[
                      "Enviar WhatsApp para o cliente",
                      "Adicionar ao Mailchimp Audience",
                      "Exportar lead para Google Sheets",
                      "Notificar Administrador por Email",
                      "Sincronizar contactos no HubSpot"
                    ].map((act, ai) => (
                      <button
                        key={ai}
                        onClick={() => {
                          setAutomationSteps(prev => [...prev, act]);
                          setAddingStep(false);
                        }}
                        className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-brand-gold/5 border border-slate-850 hover:border-brand-gold/15 text-xs text-slate-300 hover:text-white transition-all"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setAddingStep(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-white pt-2 block"
                  >
                    Cancelar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* DYNAMIC APP CONFIGURATION OVERLAY VIEW (MODAL SIMULATOR) */}
      {activeConfigApp !== null && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl glass-morphism border border-slate-800/80 p-6 space-y-6"
        >
          {/* Active app header */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <button 
              onClick={() => setActiveConfigApp(null)} 
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-all py-1.5 px-3 rounded-lg bg-white/5 border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" /> Cancelar
            </button>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-gold" />
              Configurar: {activeConfigApp.name}
            </h3>
          </div>

          {/* Form wrapper */}
          <div className="max-w-xl mx-auto space-y-6 py-4">
            <div className="space-y-4">
              {activeConfigApp.fields.map((fld) => (
                <div key={fld.name} className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">{fld.label}</label>
                  
                  {fld.type === "text" && (
                    <input 
                      type="text"
                      value={configFormValues[fld.name] || ""}
                      onChange={(e) => setConfigFormValues({ ...configFormValues, [fld.name]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-gold/30"
                    />
                  )}

                  {fld.type === "password" && (
                    <input 
                      type="password"
                      value={configFormValues[fld.name] || ""}
                      onChange={(e) => setConfigFormValues({ ...configFormValues, [fld.name]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-gold/30"
                    />
                  )}

                  {fld.type === "checkbox" && (
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input 
                        type="checkbox"
                        checked={configFormValues[fld.name] || false}
                        onChange={(e) => setConfigFormValues({ ...configFormValues, [fld.name]: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-900 text-brand-gold focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-xs text-slate-350">Ativar esta opção</span>
                    </label>
                  )}

                  {fld.type === "select" && (
                    <select
                      value={configFormValues[fld.name] || ""}
                      onChange={(e) => setConfigFormValues({ ...configFormValues, [fld.name]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    >
                      {fld.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {savingConfig ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  A guardar configuração...
                </>
              ) : "Instalar e Guardar Configuração"}
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
}
