import React from 'react';
import { Printer, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const PaymentInvoice = ({ invoice, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div className="w-full max-w-2xl bg-[#111112] border-2 border-[#D4AF37]/20 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
      <div className="flex justify-between items-start border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-[0.2em] text-[#D4AF37]">VERA</h2>
          <p className="text-xs font-mono text-zinc-500 mt-1">HOROLOGICAL MANUFACTURE REALIZATION LEDGER</p>
        </div>
        <div className="text-right font-mono text-xs text-zinc-400 space-y-1">
          <p className="text-zinc-200 font-bold tracking-wider">OFFICIAL REVENUE STATEMENT</p>
          <p>STATEMENT ID: INV-{invoice?.id || '98234'}</p>
          <p>LOG DATE: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 text-xs font-mono">
        <div className="space-y-1">
          <p className="text-zinc-500 uppercase font-bold tracking-widest">Authorized Clearing Post</p>
          <p className="text-zinc-300 font-bold">VERA LUXURY DISTRIBUTION HUB</p>
          <p className="text-zinc-500">Node Secure Location Protocol: Karachi Hub</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-zinc-500 uppercase font-bold tracking-widest">Acquiring Counterparty Entity</p>
          <p className="text-zinc-200 font-bold">{invoice?.customerName || 'Private Acquisition Collector'}</p>
          <p className="text-zinc-500">{invoice?.customerEmail || 'Authenticated Client Account'}</p>
        </div>
      </div>
      <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
        <div className="grid grid-cols-3 bg-white/[0.02] p-3 text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider border-b border-white/5">
          <div>Structural Component Mapping</div>
          <div className="text-center">Allocation Vol</div>
          <div className="text-right">Unit Value</div>
        </div>
        <div className="p-3 grid grid-cols-3 text-xs font-mono text-zinc-300 items-center">
          <div>{invoice?.watchModel || 'Luxury Horizon Caliber Unit Asset'}</div>
          <div className="text-center text-zinc-500">1</div>
          <div className="text-right text-zinc-100 font-bold">{formatCurrency(invoice?.amount || 16500)}</div>
        </div>
      </div>
      <div className="flex justify-between items-center border-t border-white/5 pt-6">
        <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs">
          <ShieldCheck size={16} />
          <span className="uppercase tracking-widest font-bold">Cryptographic Ledger Clearing Verified</span>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Settled Aggregate Balance</p>
          <p className="text-2xl font-bold font-mono text-zinc-100">{formatCurrency(invoice?.amount || 16500)}</p>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-white/[0.03]">
        <button onClick={onClose} className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold rounded-xl transition-colors">Dismiss</button>
        <button onClick={() => window.print()} className="px-5 py-2 bg-luxury-gold-btn text-black text-xs font-bold rounded-xl flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <Printer size={14} />
          <span>Execute Print Form</span>
        </button>
      </div>
    </div>
  </div>
);

export default PaymentInvoice;