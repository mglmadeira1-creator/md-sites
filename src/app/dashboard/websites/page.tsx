"use client";

import Link from "next/link";
import { PlusCircle, Globe, ExternalLink, Edit2, Trash2 } from "lucide-react";

export default function WebsitesPage() {
  const websites = [
    {
      id: "web-1",
      name: "Café Central",
      url: "cafecentral.mdsites.app",
      domain: "cafecentral.pt",
      status: "Publicado",
      theme: "Azul & Ouro"
    },
    {
      id: "web-2",
      name: "Studio Glow Estética",
      url: "studioglow.mdsites.app",
      domain: "Nenhum",
      status: "Rascunho",
      theme: "Monocromático"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Os meus Websites</h1>
          <p className="text-xs text-slate-400">Gere e edita todos os websites criados com IA.</p>
        </div>
        <Link
          href="/simular"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark text-xs font-bold transition-all"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Novo Website
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {websites.map((web) => (
          <div key={web.id} className="rounded-2xl glass-morphism border border-slate-800/80 p-6 flex flex-col justify-between h-[180px]">
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  web.status === "Publicado" ? "bg-emerald-500/10 text-emerald-400" : "bg-brand-gold/10 text-brand-gold"
                }`}>
                  {web.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Paleta: {web.theme}</span>
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
    </div>
  );
}
