import React from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const OrderDetails = ({ order, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="w-full max-w-lg bg-[#161618] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h3 className="text-sm font-bold tracking-widest text-[#D4AF37]">TRANSACTION METADATA #TXN-{order.id}</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
      </div>
      <div className="space-y-2 text-sm text-zinc-400">
        <p><strong className="text-zinc-200">Client Signature:</strong> {order.customerName}</p>
        <p><strong className="text-zinc-200">Settled Gross:</strong> {formatCurrency(order.totalAmount)}</p>
        <div className="p-3 bg-[#0B0B0C] rounded-xl border border-white/5 mt-4">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Item Allocation Map</p>
          <div className="text-xs font-mono text-zinc-300">1x Chronograph Collection Reference Engine Asset</div>
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetails;