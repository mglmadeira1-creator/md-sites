"use client";

import { useState } from "react";
import { Globe, Plus, AlertCircle, CheckCircle } from "lucide-react";

export default function DominiosPage() {
  const [domainName, setDomainName] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const mockDomains = [
    { name: "cafecentral.pt", status: "Activo", website: "Café Central", type: "Personalizado" },
    { name: "studioglow.mdsites.app", status: "Activo", website: "Studio Glow Estética", type: "MD Sites Subdomínio" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestão de Domínios</h1>
        <p className="text-xs text-slate-400">Associe domínios personalizados aos seus websites criados com Inteligência Artificial.</p>
      </div>

      {/* Connect domain Form */}
      <div className="rounded-2xl glass-morphism border border-slate-800/80 p-6 space-y-4">
        <h3 className="text-md font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-gold" />
          Ligar Domínio Personalizado
        </h3>
        <p className="text-xs text-slate-400">
          Insira o domínio que já possui (ex: o-seu-negocio.pt) e configure os apontamentos DNS no seu registador de domínios.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            placeholder="exemplo.com"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            className="flex-1 bg-brand-blue-dark border border-slate-800 focus:border-brand-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
          />
          <button
            onClick={() => {
              if (!domainName) return;
              setIsLinking(true);
              setTimeout(() => {
                setIsLinking(false);
                setDomainName("");
                alert("Simulação: Domínio registado! Agora configure os servidores DNS apontando para ns1.mdsites.app.");
              }, 1200);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs rounded-xl flex items-center gap-1.5 justify-center"
          >
            <Plus className="w-4 h-4" />
            Ligar Domínio
          </button>
        </div>
      </div>

      {/* Domains Table List */}
      <div className="rounded-2xl border border-slate-800/80 overflow-hidden bg-[#0d1527]/30 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Domínio</th>
              <th className="py-4 px-6">Website Associado</th>
              <th className="py-4 px-6">Tipo</th>
              <th className="py-4 px-6">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/65 text-xs sm:text-sm">
            {mockDomains.map((dom, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-gold" />
                  {dom.name}
                </td>
                <td className="py-4 px-6 text-slate-300">{dom.website}</td>
                <td className="py-4 px-6 text-slate-400">{dom.type}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {dom.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
