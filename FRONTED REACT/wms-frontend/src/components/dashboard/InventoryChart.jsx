import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InventoryChart = ({ data }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
        <XAxis dataKey="brand" stroke="#1111e2" fontSize={11} tickLine={false} />
        <YAxis stroke="#0f0feb" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#161618', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
        <Bar dataKey="stock" fill="#27272A" radius={[4, 4, 0, 0]} activeBar={{ fill: '#5cb3db' }} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default InventoryChart;