import React from 'react';
import { motion } from 'motion/react';
import { History, Receipt, ChevronLeft, Calendar, Coins } from 'lucide-react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils';

interface OrderHistoryProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

export default function OrderHistory({ invoices, onSelectInvoice }: OrderHistoryProps) {
  if (invoices.length === 0) return null;

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-850 shadow-xl p-5 space-y-4 text-stone-100">
      <div className="flex items-center gap-2 pb-2 border-b border-stone-800">
        <div className="bg-amber-950/40 p-2 rounded-xl text-amber-400 border border-amber-900/40">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">سجل الفواتير الصادرة</h3>
          <p className="text-[10px] text-stone-500 font-mono">Invoice History • {invoices.length}</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-0.5">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            onClick={() => onSelectInvoice(inv)}
            className="group flex items-center justify-between p-3 bg-stone-950 hover:bg-amber-950/20 rounded-xl border border-stone-850 hover:border-amber-900/40 transition-all cursor-pointer text-right"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-900 group-hover:bg-amber-950/60 text-stone-500 group-hover:text-amber-400 flex items-center justify-center transition-colors border border-stone-800/80">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200 font-mono">
                  {inv.invoiceNumber.split('-')[2]}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-stone-500 mt-0.5">
                  <Calendar className="w-3 h-3 text-stone-600" />
                  <span>{new Date(inv.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>{inv.items.reduce((sum, item) => sum + item.quantity, 0)} وجبات</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="text-left">
                <p className="text-xs font-bold text-white">
                  {formatCurrency(inv.total)}
                </p>
                <span className="text-[9px] font-semibold text-emerald-300 px-1.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-900/30">
                  مكتملة
                </span>
              </div>
              <ChevronLeft className="w-4 h-4 text-stone-500 group-hover:text-amber-450 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
