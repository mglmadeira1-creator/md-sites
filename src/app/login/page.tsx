"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, Mail, Lock, Check, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Real Supabase Auth attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Fallback for Demo/Local environment when Supabase keys are default/missing
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
        ) {
          setSuccessMsg("Ligado com sucesso! (Modo de Demonstração Local Ativo)");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          setErrorMsg(error.message);
        }
      } else if (data.user) {
        setSuccessMsg("Login efetuado com sucesso! A redirecionar...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      }
    } catch (err) {
      setErrorMsg("Ocorreu um erro ao tentar efetuar login.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@mdsites.app");
    setPassword("demo12345");
    setSuccessMsg("Redirecionando no modo de demonstração...");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center p-6 text-slate-100 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fundo-paginas.png')" }}
    >
      {/* Background Overlay filter matching landing page */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] -z-10" />

      {/* Glow Halo decor */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[140px] -top-60 -left-60 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[140px] -bottom-60 -right-60 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Branding Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="relative w-80 h-24 overflow-hidden flex items-center justify-center mx-auto">
            <Image
              src="/logonovo.png"
              alt="MD Sites Logo"
              fill
              className="object-contain scale-[3.2] transform origin-center"
              priority
            />
          </Link>
          <p className="text-xs text-slate-400">Acede ao painel geral para gerir e criar os teus websites com IA.</p>
        </div>

        {/* Neon Gradient border wrapper */}
        <div 
          className="rounded-2xl p-[2px] relative"
          style={{
            background: "linear-gradient(225deg, #D4AF37 0%, #D4AF37 40%, #3b82f6 60%, #3b82f6 100%)",
            boxShadow: "0 0 50px -10px rgba(59, 130, 246, 0.5), 0 0 50px -10px rgba(212, 175, 55, 0.4)"
          }}
        >
          {/* Login Card Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[14px] backdrop-blur-lg bg-slate-950/90 p-8 shadow-2xl relative overflow-hidden"
          >
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              Iniciar Sessão
            </h2>

            {/* Success and Error Alerts */}
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

            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Palavra-passe</label>
                  <Link href="#" className="text-[10px] font-bold text-brand-gold hover:underline">Esqueci-me?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduz a palavra-passe"
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
                    A entrar...
                  </>
                ) : "Entrar no Painel"}
              </button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <span className="relative px-3 bg-[#030712] text-[10px] text-slate-500 font-bold uppercase">Ou</span>
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full py-3 border border-slate-800 hover:border-brand-gold/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-350 hover:text-white rounded-xl transition-all"
            >
              Aceder como Utilizador Demo
            </button>
          </div>
          </motion.div>
        </div>

        {/* Link back or switch to register */}
        <div className="text-center text-xs text-slate-450">
          Não tens uma conta?{" "}
          <Link href="/register" className="font-bold text-brand-gold hover:underline">
            Cria uma agora ➔
          </Link>
        </div>

      </div>
    </div>
  );
}
