import React, { useState } from "react";
import { watchService } from "../../services/watchService.js";
import { Zap, X, Save, Loader2 } from "lucide-react";

const WatchForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    modelName: "", brandId: "1", categoryId: "1", 
    price: "", stockQuantity: "", color: "", imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend DTO structure ke mutabiq payload
      const payload = {
        modelName: formData.modelName,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        color: formData.color,
        imageUrl: formData.imageUrl,
        brandId: parseInt(formData.brandId),
        categoryId: parseInt(formData.categoryId)
      };

      await watchService.create(payload);
      alert("Asset Registered Successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Full Error Details:", err);
      alert("Failed to save: Check Console for Backend Errors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-zinc-800 p-8 rounded-3xl shadow-2xl w-[500px] animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="text-[#D4AF37]" /> New Asset
          </h2>
          <button type="button" onClick={onCancel} className="text-zinc-500 hover:text-white transition"><X /></button>
        </div>

        <div className="space-y-4">
          <input name="modelName" placeholder="Model Name" onChange={handleChange} required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-[#D4AF37]" />
          
          <div className="grid grid-cols-2 gap-4">
            <input name="price" type="number" placeholder="Price (PKR)" onChange={handleChange} required className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-[#D4AF37]" />
            <input name="stockQuantity" type="number" placeholder="Stock Qty" onChange={handleChange} required className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-[#D4AF37]" />
          </div>

          <input name="imageUrl" placeholder="Image URL" onChange={handleChange} required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-[#D4AF37]" />
        </div>

        <button 
          disabled={loading}
          className="w-full mt-8 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> SAVE ASSET</>}
        </button>
      </form>
    </div>
  );
};

export default WatchForm;