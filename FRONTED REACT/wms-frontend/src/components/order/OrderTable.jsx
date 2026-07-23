import React from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const OrderTable = ({ data, onViewDetails }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-luxury-carbon">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-white/5 bg-white/[0.01] text-xs text-zinc-500 uppercase tracking-wider">
          <th className="p-4">Transaction hash</th>
          <th className="p-4">Client Target</th>
          <th className="p-4">Timestamp</th>
          <th className="p-4">Gross Ledger</th>
          <th className="p-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.03] text-sm text-zinc-300">
        {data.map((order) => (
          <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
            <td className="p-4 font-mono text-zinc-400">#TXN-{order.id}</td>
            <td className="p-4 font-medium text-zinc-100">{order.customerName || 'Direct Showroom Walk-in'}</td>
            <td className="p-4 text-zinc-400">{formatDate(order.orderDate)}</td>
            <td className="p-4 text-emerald-400 font-mono font-bold">{formatCurrency(order.totalAmount)}</td>
            <td className="p-4 text-right">
              <button onClick={() => onViewDetails(order)} className="text-xs text-[#D4AF37] hover:underline">View Artifacts</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderTable;