import React, { useState } from 'react';

const RepairForm = ({ onSave, onClose }) => {
  const [description, setDescription] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#161618] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">Initiate Caliber Structural Diagnosis</h3>
        <textarea 
          placeholder="Document anomaly presentation, structural variances, amplitude metrics..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full h-24 bg-[#0B0B0C] border border-white/5 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg">Cancel</button>
          <button onClick={() => onSave({ description })} className="px-4 py-1.5 bg-luxury-gold-btn text-black text-xs font-bold rounded-lg">Authorize Pipeline</button>
        </div>
      </div>
    </div>
  );
};
const handleAdd = async () => {
    if (!formData.watchModel || !formData.customerName) {
        alert("Watch Model aur Customer Name required hai."); return;
    }
    const payload = {
        ...formData,
        serviceCost: parseFloat(formData.serviceCost) || 0,
        technicianId: formData.technicianId ? parseInt(formData.technicianId) : null
    };
    
    // ✅ Ye add karo — console mein dekho kya ja raha hai
    console.log("Sending payload:", JSON.stringify(payload));
    
    const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    // ✅ Ye bhi add karo
    console.log("Response status:", res.status);
    
    if (res.ok) { ADDED}
};
export default RepairForm;