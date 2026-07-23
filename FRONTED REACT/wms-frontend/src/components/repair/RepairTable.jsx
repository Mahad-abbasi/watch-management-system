import React from 'react';

const RepairTable = ({ data, onUpdateStatus }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-luxury-carbon">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-white/5 bg-white/[0.01] text-xs text-zinc-500 uppercase tracking-wider">
          <th className="p-4">Ticket</th>
          <th className="p-4">Horological Mechanism Asset</th>
          <th className="p-4">Assigned Engineer</th>
          <th className="p-4">Operational State</th>
          <th className="p-4 text-right">State Matrix</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.03] text-sm text-zinc-300">
        {data.map((repair) => (
          <tr key={repair.id} className="hover:bg-white/[0.01] transition-colors">
            <td className="p-4 font-mono text-xs text-zinc-500">#REP-{repair.id}</td>
            <td className="p-4 font-medium text-zinc-200">{repair.watchModel || 'Caliber Movement Assembly'}</td>
            <td className="p-4 text-zinc-400">{repair.technicianName || 'Unassigned Lab Resource'}</td>
            <td className="p-4">
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-mono">
                {repair.status || 'In Diagnostic Phase'}
              </span>
            </td>
            <td className="p-4 text-right">
              <select 
                onChange={(e) => onUpdateStatus(repair.id, e.target.value)}
                value={repair.status || 'In Diagnosis'}
                className="bg-[#0B0B0C] border border-white/5 text-xs rounded-lg px-2 py-1 text-zinc-300 focus:outline-none"
              >
                <option value="In Diagnosis">Diagnostic Verification</option>
                <option value="In Progress">Caliber Tuning</option>
                <option value="Completed">Execution Success</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RepairTable;