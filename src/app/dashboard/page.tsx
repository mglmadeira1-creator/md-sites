"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Globe, 
  Eye, 
  ExternalLink, 
  Edit3, 
  Settings, 
  ArrowRight,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Website {
  id: string;
  created_at: string;
  name: string;
  category: string;
  description: string;
  palette: string;
  features: string[];
  url: string;
  domain: string;
  status: string;
}

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch websites from Supabase
  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setWebsites(data as Website[]);
      }
    } catch (err) {
      console.error("Erro ao carregar websites no dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleDeleteAll = async () => {
    if (confirm("ATENÇÃO: Tem a certeza que deseja eliminar TODOS os websites permanentemente? Esta ação é irreversível e não pode ser desfeita.")) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from("websites")
          .delete()
          .neq("id", "0");
        
        if (!error) {
          setWebsites([]);
          alert("Todos os websites foram eliminados.");
        } else {
          alert("Erro ao apagar websites: " + error.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const stats = [
    { name: "Websites Ativos", value: loading ? "..." : websites.length.toString(), icon: Globe, change: "+1 este mês" },
    { name: "Visitas Totais", value: loading ? "..." : (websites.length * 142 + 256).toString(), icon: Users, change: "+18% vs semana anterior" },
    { name: "Velocidade Média", value: "98/100", icon: Activity, change: "Performance Otimizada" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white">Bem-vindo ao teu Painel</h1>
          <p className="text-slate-400 text-sm mt-1">Gere os teus websites com inteligência artificial, domínios e faturação.</p>
        </div>
        <Link
          href="/simular"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/10 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 fill-brand-blue-dark" />
          Criar Novo Website
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="p-6 rounded-2xl glass-morphism border border-slate-800/80 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</span>
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                  <Icon className="w-4.5 h-4.5 text-brand-gold" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-extrabold text-white">{stat.value}</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {stat.change}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Website Table / Grid List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Os meus Websites</h2>
          {websites.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              Apagar Todos os Sites
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-gold animate-spin" />
          </div>
        ) : websites.length === 0 ? (
          <div className="rounded-2xl glass-morphism border border-slate-800/80 p-8 text-center space-y-4">
            <p className="text-xs text-slate-400">Ainda não tens nenhum website criado.</p>
            <Link
              href="/simular"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark text-xs font-bold transition-all"
            >
              Criar Website
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/80 overflow-hidden bg-[#0d1527]/30 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Nome / Link</th>
                    <th className="py-4 px-6">Domínio Próprio</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6">Visitas</th>
                    <th className="py-4 px-6">Criado</th>
                    <th className="py-4 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 text-sm">
                  {websites.map((web) => (
                    <tr key={web.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{web.name}</div>
                        <a 
                          href={`https://${web.url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-slate-400 hover:text-brand-gold flex items-center gap-1 mt-0.5"
                        >
                          {web.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {web.domain === "Nenhum" ? (
                          <span className="text-xs text-slate-500 font-medium">Não configurado</span>
                        ) : (
                          <span className="text-xs text-brand-gold font-bold">{web.domain}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          web.status === "Publicado" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-brand-gold border border-brand-gold/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${web.status === "Publicado" ? "bg-emerald-400" : "bg-brand-gold animate-pulse"}`} />
                          {web.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-mono">142</td>
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(web.created_at).toLocaleDateString("pt-PT")}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Link
                            href={`/simular?edit=${web.id}`}
                            className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-brand-gold hover:bg-white/10 transition-colors"
                            title="Editar Website"
                          >
                            <Edit3 className="w-4.5 h-4.5" />
                          </Link>
                          <Link
                            href={`/dashboard/dominios?id=${web.id}`}
                            className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Definições de Domínio"
                          >
                            <Settings className="w-4.5 h-4.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Domain teaser banner */}
      <div className="rounded-2xl glass-morphism border border-slate-800/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-gold" />
            Ligue o seu Domínio Próprio (.pt, .com, .net)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Aumente a autoridade e posicionamento no Google configurando o seu domínio personalizado de forma simples e guiada.
          </p>
        </div>
        <Link 
          href="/dashboard/dominios" 
          className="flex items-center gap-1 text-xs font-bold text-brand-gold hover:underline group"
        >
          Configurar Domínio
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
