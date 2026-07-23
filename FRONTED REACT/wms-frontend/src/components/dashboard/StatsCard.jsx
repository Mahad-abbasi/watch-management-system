import React from 'react';

const StatsCard = ({ title, value, icon, change, isPositive }) => (
  <div className="bg-luxury-carbon border border-white/5 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
    <div className="space-y-2">
      <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">{title}</span>
      <h3 className="text-3xl font-bold text-zinc-100 tracking-tight">{value}</h3>
      {change && (
        <p className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? '↑' : '↓'} {change} <span className="text-zinc-600">vs last month</span>
        </p>
      )}
    </div>
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-[#D4AF37]">
      {icon}
    </div>
  </div>
);

export default StatsCard;