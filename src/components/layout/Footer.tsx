import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-brand-blue-dark border-t border-slate-800/60 pt-16 pb-8 overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Image
              src="/logonovo.png"
              alt="MD Sites Logo"
              width={130}
              height={38}
              className="h-8 w-auto object-contain"
            />
            <p className="text-sm text-slate-400 leading-relaxed">
              Cria websites profissionais com Inteligência Artificial em minutos. Moderno, rápido e pronto a publicar.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#como-funciona" className="text-sm text-slate-400 hover:text-brand-gold transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#funcionalidades" className="text-sm text-slate-400 hover:text-brand-gold transition-colors">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="/simular" className="text-sm text-slate-400 hover:text-brand-gold transition-colors flex items-center gap-1">
                  Simular Website <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#precos" className="text-sm text-slate-400 hover:text-brand-gold transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <span className="text-sm text-slate-500 cursor-not-allowed">Suporte</span>
              </li>
              <li>
                <span className="text-sm text-slate-500 cursor-not-allowed">Blog</span>
              </li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-slate-500 cursor-not-allowed">Termos de Serviço</span>
              </li>
              <li>
                <span className="text-sm text-slate-500 cursor-not-allowed">Política de Privacidade</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} MD Sites. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span>Desenvolvido com IA em Portugal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
