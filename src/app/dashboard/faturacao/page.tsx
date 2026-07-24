"use client";

import { CreditCard, ShieldCheck, FileText, Download } from "lucide-react";

export default function FaturacaoPage() {
  const invoices = [
    { id: "FT-2026-001", date: "24 Jul 2026", amount: "15,00 €", method: "Visa **** 4242", status: "Pago" },
    { id: "FT-2026-002", date: "24 Jun 2026", amount: "15,00 €", method: "Visa **** 4242", status: "Pago" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Faturação e Pagamentos</h1>
        <p className="text-xs text-slate-400">Gere as suas subscrições, métodos de pagamento e consulte o histórico de faturas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="p-6 rounded-2xl glass-morphism border border-brand-gold/20 flex flex-col justify-between h-[200px] md:col-span-2">
          <div>
            <span className="text-[10px] bg-brand-gold/15 text-brand-gold font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Subscrição Pro Activa
            </span>
            <h3 className="text-xl font-bold text-white mt-4">15,00 € <span className="text-xs text-slate-400 font-normal">/mês (Cobrado mensalmente)</span></h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Próxima data de faturação: <strong>24 de Agosto de 2026</strong> via cartão de crédito associado.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-all">
              Alterar Plano
            </button>
            <button className="px-4 py-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-semibold rounded-xl text-rose-400 transition-all">
              Cancelar Subscrição
            </button>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="p-6 rounded-2xl glass-morphism border border-slate-800/80 flex flex-col justify-between h-[200px]">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Método de Pagamento</h4>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-8 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">
                VISA
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Visa terminado em 4242</span>
                <span className="text-[10px] text-slate-500">Expira em 12/28</span>
              </div>
            </div>
          </div>
          <button className="w-full py-2 border border-slate-800 hover:border-slate-700 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl text-slate-350 hover:text-white transition-all flex items-center justify-center gap-1.5">
            <CreditCard className="w-4 h-4" />
            Atualizar Cartão
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Histórico de Faturas</h3>
        <div className="rounded-2xl border border-slate-800/80 overflow-hidden bg-[#0d1527]/30 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID Fatura</th>
                <th className="py-4 px-6">Data de Emissão</th>
                <th className="py-4 px-6">Valor Cobrado</th>
                <th className="py-4 px-6">Método</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/65 text-xs sm:text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{inv.id}</td>
                  <td className="py-4 px-6 text-slate-300">{inv.date}</td>
                  <td className="py-4 px-6 text-slate-300 font-mono">{inv.amount}</td>
                  <td className="py-4 px-6 text-slate-450">{inv.method}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Download PDF">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
