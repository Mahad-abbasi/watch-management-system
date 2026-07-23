import React, { useState, useEffect } from 'react';
import { Watch, Wrench, DollarSign, ArrowUpRight, ArrowDownRight, Layers, Activity } from 'lucide-react';

const mockInventorySummary = [
  { brand: 'PATEK PHILIPPE', stock: 14, percentage: 31, color: '#D4AF37' },
  { brand: 'ROLEX', stock: 28, percentage: 62, color: '#a1a1aa' },
  { brand: 'AUDEMARS PIGUET', stock: 9, percentage: 20, color: '#d97706' },
  { brand: 'VACHERON CONSTANTIN', stock: 11, percentage: 24, color: '#78716c' },
  { brand: 'GRAND SEIKO', stock: 45, percentage: 100, color: '#10b981' },
];

const LocalStatsCard = ({ title, value, icon, change, isPositive }) => (
  <div
    className="group relative rounded-xl p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 overflow-hidden"
    style={{
      background: 'rgba(12, 12, 14, 0.7)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.05)',
    }}
    onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(212,175,55,0.25)'}
    onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'}
  >
    <div className="flex justify-between items-start">
      <div>
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase block" style={{ color: 'rgba(161,150,120,0.6)' }}>{title}</span>
        <span className="text-3xl font-bold font-mono tracking-tight mt-2 block" style={{ color: '#f0e8d0' }}>{value}</span>
      </div>
      <div className="p-3 rounded-xl" style={{
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(212,175,55,0.2)',
        color: '#D4AF37',
      }}>
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2 mt-5 pt-3 text-xs font-mono" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      {isPositive ? (
        <span className="flex items-center px-1.5 py-0.5 rounded" style={{ color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <ArrowUpRight size={12} className="mr-0.5" /> {change}
        </span>
      ) : (
        <span className="flex items-center px-1.5 py-0.5 rounded" style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <ArrowDownRight size={12} className="mr-0.5" /> {change}
        </span>
      )}
      <span style={{ color: 'rgba(100,90,75,0.8)' }}>vs historical baseline</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState({ sales: 0, repairs: 0, inventory: 0 });
  const [waveform, setWaveform] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/analytics')
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(resData => {
        if (resData?.cards) setData({ sales: resData.cards.sales || 0, repairs: resData.cards.repairs || 0, inventory: resData.cards.inventory || 0 });
        if (resData?.waveform) setWaveform(resData.waveform);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const maxRevenue = waveform.length > 0 ? Math.max(...waveform.map(w => w.revenue || 1)) : 1;

  return (
    <div className="space-y-8 min-h-screen pb-12 animate-fade-in">

      {/* Header */}
      <div className="flex justify-between items-end pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase mb-1" style={{ color: '#D4AF37' }}>
            <Layers size={12} /> Core Visual Core
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider uppercase" style={{ color: '#f0e8d0' }}>
            Executive Overview
          </h1>
          <p className="text-sm" style={{ color: 'rgba(161,150,120,0.6)' }}>Real-time macro visual analytics overview matrix.</p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-md flex items-center gap-2" style={{
          background: 'rgba(212,175,55,0.05)',
          border: '1px solid rgba(212,175,55,0.15)',
          color: 'rgba(212,175,55,0.7)',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 6px #D4AF37', animation: 'pulseRing 2s ease-out infinite', display: 'inline-block' }} />
          SECURE DATALINK ACTIVE
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center py-12 text-xs font-mono animate-pulse" style={{ color: 'rgba(161,150,120,0.4)' }}>
          CALCULATING REVENUE AND STOCK AGGREGATES...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LocalStatsCard title="Total Watches in Stock" value={`${data.inventory.toLocaleString()} Units`} icon={<Watch size={18} />} change="Database-Live" isPositive={true} />
          <LocalStatsCard title="Active Repair Orders" value={`${data.repairs} Active`} icon={<Wrench size={18} />} change="Current" isPositive={data.repairs === 0} />
          <LocalStatsCard title="Total Sales (MTD)" value={`$${data.sales.toLocaleString()}`} icon={<DollarSign size={18} />} change="Dynamic" isPositive={true} />
        </div>
      )}

      {/* Chart + Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all duration-500"
          style={{ background: 'rgba(10,10,12,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2" style={{ color: '#D4AF37' }}>
              <Activity size={12} style={{ animation: 'pulseRing 2s ease-out infinite' }} /> Monthly Performance Architecture
            </h3>
            <p className="text-xs font-mono" style={{ color: 'rgba(100,90,75,0.7)' }}>Dynamic repository tracking matrix</p>
          </div>

          <div className="h-56 w-full relative flex items-end justify-between gap-3 pb-2 px-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
          >
            {loading || waveform.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(100,90,75,0.5)' }}>
                Awaiting Stream Telemetry...
              </div>
            ) : (
              waveform.map((item, idx) => {
                const heightPercent = Math.max(6, Math.min(100, ((item.revenue || 0) / maxRevenue) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative group/bar">
                    {/* Tooltip */}
                    <div className="absolute opacity-0 group-hover/bar:opacity-100 pointer-events-none z-30 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap transition-all duration-200"
                      style={{ top: '-22px', background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
                    >
                      ${(item.revenue || 0).toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div
                      style={{
                        height: `${heightPercent}%`,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(170,124,17,0.3), #D4AF37)',
                        borderRadius: '4px 4px 0 0',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderBottom: 'none',
                        boxShadow: '0 0 12px rgba(212,175,55,0.08)',
                        transition: 'all 0.8s ease-out',
                      }}
                      className="group-hover/bar:brightness-125"
                    />

                    <span className="text-[10px] font-mono mt-2 block transition-colors group-hover/bar:text-zinc-200"
                      style={{ color: 'rgba(161,150,120,0.5)' }}
                    >
                      {item.timeline}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Brands */}
        <div className="rounded-2xl p-6 flex flex-col transition-all duration-500"
          style={{ background: 'rgba(10,10,12,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(200,190,170,0.7)' }}>Top Selling Brands</h3>
            <p className="text-xs font-mono" style={{ color: 'rgba(100,90,75,0.6)' }}>Brand asset volumetric holding densities</p>
          </div>
          <div className="space-y-4">
            {mockInventorySummary.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: 'rgba(200,190,170,0.7)' }}>{item.brand}</span>
                  <span style={{ color: 'rgba(161,150,120,0.5)' }}>{item.stock} Watches</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '999px',
                    transition: 'width 1s ease-out',
                    boxShadow: `0 0 8px ${item.color}40`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}