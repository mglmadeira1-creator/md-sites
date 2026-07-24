"use client";

import { useState } from "react";
import { User, Shield, Key } from "lucide-react";

export default function ContaPage() {
  const [profile, setProfile] = useState({
    name: "Utilizador Demo",
    email: "demo@mdsites.app",
    role: "Freelancer"
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações de Conta</h1>
        <p className="text-xs text-slate-400">Edite as suas credenciais pessoais e aceda a chaves de integração API.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl glass-morphism border border-slate-800/85 md:col-span-2 space-y-6">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-brand-gold" />
            Dados do Perfil
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Nome Completo</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-brand-blue-dark border border-slate-800 focus:border-brand-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Endereço de Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-brand-blue-dark border border-slate-800 focus:border-brand-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button className="px-5 py-2.5 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold text-xs rounded-xl transition-all">
              Guardar Alterações
            </button>
          </div>
        </div>

        {/* Security / API Credentials Card */}
        <div className="p-6 rounded-2xl glass-morphism border border-slate-800/85 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-gold" />
              Segurança
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mantenha o seu acesso seguro alterando a palavra-passe ou gerando chaves para acesso à API externa.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <button className="w-full py-2.5 border border-slate-800 hover:border-slate-700 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5">
              <Key className="w-4 h-4" />
              Alterar Palavra-passe
            </button>
            <button className="w-full py-2.5 border border-slate-800 hover:border-slate-750 bg-white/5 text-xs font-semibold rounded-xl text-slate-500 cursor-not-allowed flex items-center justify-center gap-1.5">
              Obter API Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
