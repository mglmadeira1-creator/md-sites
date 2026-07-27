"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Globe, ExternalLink, Edit2, Trash2 } from "lucide-react";
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

export default function WebsitesPage() {
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
      console.error("Erro ao carregar websites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  // Handle Delete website CRUD action
  const handleDelete = async (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este website permanentemente?")) {
      try {
        const { error } = await supabase
          .from("websites")
          .delete()
          .eq("id", id);
        
        if (!error) {
          // Remove from local state
          setWebsites(prev => prev.filter(web => web.id !== id));
        }
      } catch (err) {
        console.error("Erro ao eliminar website:", err);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm("ATENÇÃO: Tem a certeza que deseja eliminar TODOS os websites permanentemente? Esta ação é irreversível.")) {
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
          alert("Erro ao apagar: " + error.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Os meus Websites</h1>
            <p className="text-xs text-slate-400">Gere e edita todos os websites criados com IA.</p>
          </div>
          {websites.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-xs font-bold rounded-xl transition-all"
            >
              Apagar Todos os Sites
            </button>
          )}
        </div>
        <Link
          href="/simular"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark text-xs font-bold transition-all"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Novo Website
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-gold animate-spin" />
        </div>
      ) : websites.length === 0 ? (
        <div className="rounded-2xl glass-morphism border border-slate-800/80 p-12 text-center space-y-4">
          <p className="text-sm text-slate-400">Ainda não tens nenhum website criado. Cria o teu primeiro website com a nossa IA!</p>
          <Link
            href="/simular"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark text-xs font-bold transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Criar Website Agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websites.map((web) => (
            <div key={web.id} className="rounded-2xl glass-morphism border border-slate-800/80 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    web.status === "Publicado" ? "bg-emerald-500/10 text-emerald-400" : "bg-brand-gold/10 text-brand-gold"
                  }`}>
                    {web.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Paleta: {web.palette}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-3">{web.name}</h3>
                <a 
                  href={`https://${web.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-brand-gold flex items-center gap-1 mt-1"
                >
                  {web.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-4">
                <span className="text-xs text-slate-500">
                  Domínio: <strong className="text-slate-350">{web.domain}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/simular?edit=${web.id}`}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white flex items-center gap-1 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(web.id)}
                    className="p-1.5 bg-rose-500/5 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/10 rounded-lg text-rose-400 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
