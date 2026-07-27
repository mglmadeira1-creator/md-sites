"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, Mail, Lock, User, Check, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("As palavras-passe introduzidas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("A palavra-passe deve conter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Supabase signUp request
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        // Local fallback if Supabase placeholders are unconfigured
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
        ) {
          setSuccessMsg("Conta Demo criada! A aceder ao painel...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1200);
        } else {
          setErrorMsg(error.message);
        }
      } else if (data.user) {
        setSuccessMsg("Conta registada com sucesso! Verifica o teu email para a ativação.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setErrorMsg("Ocorreu um erro inesperado ao tentar registar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#030712] flex items-center justify-center p-6 text-slate-100 overflow-hidden">
      
      {/* Background decoration */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-30 opacity-60 pointer-events-none"
        style={{ backgroundImage: "url('/fundo-paginas.png')" }}
      />
      <div className="absolute inset-0 bg-[#030712] opacity-85 -z-20" />

      {/* Halos */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] -top-60 -left-60 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] -bottom-60 -right-60 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Branding Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="relative w-64 h-16 overflow-hidden flex items-center justify-center mx-auto">
            <Image
              src="/logonovo.png"
              alt="MD Sites Logo"
              fill
              className="object-contain scale-[2.2] transform origin-center"
              priority
            />
          </Link>
          <p className="text-xs text-slate-400">Cria o teu perfil para começar a desenhar marcas e sites com IA.</p>
        </div>

        {/* Register Card Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass-morphism border border-slate-800/80 p-8 shadow-2xl relative overflow-hidden"
          style={{ boxShadow: "0 0 50px -10px rgba(212,175,55,0.2), 0 0 80px -30px rgba(59,130,246,0.25)" }}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              Criar Nova Conta
            </h2>

            {/* Notifications Alerts */}
            {successMsg && (
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Introduz o teu nome"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-brand-gold/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Endereço de Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-brand-gold/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-brand-gold/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Confirmar Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repete a palavra-passe"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-brand-gold/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-amber-400 text-brand-blue-dark font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    A criar conta...
                  </>
                ) : "Registar Conta"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Link back or switch to login */}
        <div className="text-center text-xs text-slate-450">
          Já tens conta?{" "}
          <Link href="/login" className="font-bold text-brand-gold hover:underline">
            Inicia sessão aqui ➔
          </Link>
        </div>

      </div>
    </div>
  );
}
