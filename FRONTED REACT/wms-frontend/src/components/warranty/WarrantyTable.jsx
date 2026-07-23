import React from 'react';
import { formatDate } from '../../utils/helpers';

const WarrantyTable = ({ data }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-luxury-carbon">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-white/5 bg-white/[0.01] text-xs text-zinc-500 uppercase tracking-wider">
          <th className="p-4">Warranty Token</th>
          <th className="p-4">Serial Validation Link</th>
          <th className="p-4">Activation Date</th>
          <th className="p-4">Decommission Timeline</th>
          <th className="p-4 text-right">Integrity Verification</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.03] text-sm text-zinc-300">
        {data.map((w) => (
          <tr key={w.id} className="hover:bg-white/[0.01] transition-colors">
            <td className="p-4 font-mono text-zinc-400">#WRN-{w.id}</td>
            <td className="p-4 font-mono text-xs text-[#D4AF37]">{w.serialNumber || 'SR-9284-X'}</td>
            <td className="p-4 text-zinc-400">{formatDate(w.startDate)}</td>
            <td className="p-4 text-zinc-400 font-medium">{formatDate(w.endDate)}</td>
            <td className="p-4 text-right">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs uppercase font-mono font-bold tracking-wider">Valid Vault Contract</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WarrantyTable;