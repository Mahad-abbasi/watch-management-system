import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis dataKey="timeline" stroke="#52525B" fontSize={11} tickLine={false} />
        <YAxis stroke="#52525B" fontSize={11} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#161618', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
          labelStyle={{ color: '#A1A1AA', fontWeight: 600 }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#salesGlow)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SalesChart;