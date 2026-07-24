"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Globe, 
  PlusCircle, 
  CreditCard, 
  User, 
  LogOut,
  Bell,
  ChevronRight,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Painel Geral", href: "/dashboard", icon: LayoutDashboard },
    { name: "Os meus Websites", href: "/dashboard/websites", icon: Globe },
    { name: "AI Studio", href: "/dashboard/ai-studio", icon: Sparkles },
    { name: "Criar Website", href: "/simular", icon: PlusCircle },
    { name: "Domínios", href: "/dashboard/dominios", icon: Globe },
    { name: "Faturação", href: "/dashboard/faturacao", icon: CreditCard },
    { name: "A minha Conta", href: "/dashboard/conta", icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0d1527]/60 border-r border-slate-800/80 p-6 space-y-6 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Image
              src="/logonovo.png"
              alt="MD Sites Logo"
              width={130}
              height={38}
              className="h-8 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/25" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-850 pt-4">
          <button 
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:text-rose-350 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sair do SaaS</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Menu Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-64 max-w-xs h-full bg-[#0d1527] border-r border-slate-800 p-6 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Image
                    src="/logonovo.png"
                    alt="MD Sites Logo"
                    width={110}
                    height={32}
                    className="h-7 w-auto object-contain"
                  />
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-1.5 pt-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive 
                            ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" 
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4.5 h-4.5" />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div>
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Sair do SaaS</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-[#0d1527]/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
              Área do Utilizador
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white relative p-1.5 bg-white/5 rounded-xl border border-slate-800 transition-all">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-blue-dark font-extrabold flex items-center justify-center text-sm shadow-md">
                UD
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-bold text-white block">Utilizador Demo</span>
                <span className="text-[10px] text-slate-500">Plano Pro Activo</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page contents wrapper */}
        <main className="flex-1 p-6 relative">
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />
          {children}
        </main>
      </div>
    </div>
  );
}
