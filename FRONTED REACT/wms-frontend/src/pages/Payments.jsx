import { useState, useEffect } from 'react';
import { CreditCard, Cpu, TrendingUp, ShoppingBag, Wrench } from 'lucide-react';

export default function Payments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalSales   = data?.cards?.sales    ?? 0;
  const totalRepairs = data?.cards?.repairs   ?? 0;
  const inventory    = data?.cards?.inventory ?? 0;

  // Settled orders revenue (from waveform sum)
  const settledRevenue = data?.waveform
    ? data.waveform.reduce((s, m) => s + (m.revenue || 0), 0)
    : 0;

  return (
    <div className="space-y-6 min-h-screen pb-12">

      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
        <div>
          <p className="text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase mb-1 flex items-center gap-2">
            <CreditCard size={12} /> Financial Hub
          </p>
          <h1 className="text-3xl font-extrabold tracking-wider text-zinc-100 uppercase">Payments Portal</h1>
          <p className="text-zinc-500 text-sm mt-1">Live revenue from orders and repair services</p>
        </div>
      </div>

      {/* Stats Cards — real data */}
      {loading ? (
        <div className="text-zinc-500 font-mono text-xs text-center py-16 animate-pulse">LOADING FINANCIAL DATA...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0D0D0E] border border-zinc-900 rounded-xl p-5 space-y-2">
            <span className="text-zinc-600 text-[9px] uppercase tracking-wider block font-mono font-bold flex items-center gap-1">
              <ShoppingBag size={10} /> Total Sales Revenue
            </span>
            <span className="text-2xl font-bold text-zinc-100 font-mono">
              ${totalSales.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">Settled orders only</span>
          </div>

          <div className="bg-[#0D0D0E] border border-zinc-900 rounded-xl p-5 space-y-2">
            <span className="text-zinc-600 text-[9px] uppercase tracking-wider block font-mono font-bold flex items-center gap-1">
              <Wrench size={10} /> Active Repair Jobs
            </span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {totalRepairs}
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">In progress tickets</span>
          </div>

          <div className="bg-[#0D0D0E] border border-zinc-900 rounded-xl p-5 space-y-2">
            <span className="text-zinc-600 text-[9px] uppercase tracking-wider block font-mono font-bold flex items-center gap-1">
              <TrendingUp size={10} /> Inventory Value Units
            </span>
            <span className="text-2xl font-bold text-zinc-100 font-mono">
              {inventory} Units
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">Total watches in stock</span>
          </div>
        </div>
      )}

      {/* Monthly Revenue Table */}
      {!loading && data?.waveform && (
        <div className="bg-[#0D0D0E] border border-zinc-900 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-900">
            <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Monthly Revenue Breakdown</p>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] uppercase tracking-wider font-mono">
                <th className="p-4">Month</th>
                <th className="p-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.waveform.map((row, i) => (
                <tr key={i} className="border-b border-zinc-900/60 hover:bg-zinc-900/20">
                  <td className="p-4 text-zinc-300 font-mono text-sm">{row.timeline}</td>
                  <td className="p-4 text-right font-bold text-emerald-400 font-mono">
                    ${(row.revenue || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-zinc-800">
                <td className="p-4 text-zinc-400 font-mono text-xs uppercase tracking-widest">Total</td>
                <td className="p-4 text-right font-bold text-[#D4AF37] font-mono">
                  ${settledRevenue.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Gateway Status */}
      <div className="bg-[#0D0D0E] border border-zinc-900 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-900 text-zinc-500">
            <Cpu size={16} />
          </div>
          <div>
            <h4 className="font-bold text-zinc-300 text-sm">System Gateway</h4>
            <p className="text-zinc-600 text-[11px] mt-0.5 font-mono">Backend connected — live data active</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded border font-bold text-emerald-400 bg-emerald-500/10 border-emerald-900/50 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
        </span>
      </div>
    </div>
  );
}