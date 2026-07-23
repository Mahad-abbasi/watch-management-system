import { useState, useEffect } from 'react';
import { Wrench, Plus, X, Pencil, Trash2, User, DollarSign, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
 
const STATUSES = ["In Diagnosis", "In Progress", "Awaiting Parts", "Completed", "Cancelled"];
const PRIORITIES = ["Low", "Normal", "High", "Critical"];
 
const statusStyle = (s) => {
    if (s === "Completed") return "bg-emerald-950/40 text-emerald-400 border-emerald-900/50";
    if (s === "In Progress") return "bg-blue-950/40 text-blue-400 border-blue-900/50";
    if (s === "Awaiting Parts") return "bg-amber-950/40 text-amber-400 border-amber-900/50";
    if (s === "Cancelled") return "bg-zinc-900 text-zinc-500 border-zinc-800";
    return "bg-purple-950/40 text-purple-400 border-purple-900/50";
};
 
const priorityStyle = (p) => {
    if (p === "Critical") return "text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse";
    if (p === "High") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (p === "Low") return "text-zinc-400 bg-zinc-800 border-zinc-700";
    return "text-blue-400 bg-blue-500/10 border-blue-500/20";
};
 
const emptyForm = {
    watchModel: '', problemDescription: '', priority: 'Normal',
    serviceCost: '', partsUsed: '', customerName: '',
    customerPhone: '', technicianId: '', status: 'In Diagnosis'
};
 
const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm transition-colors placeholder:text-zinc-600";

// ✅ FormFields is OUTSIDE main component (fixes focus/keystroke bug)
// ✅ All inputs now have id + name attributes (fixes browser autofill warning)
const FormFields = ({ data, setData, technicians }) => (
    <div className="space-y-3">
        <input
            id="watchModel" name="watchModel"
            type="text"
            placeholder="Watch Model *"
            value={data.watchModel}
            onChange={e => setData({ ...data, watchModel: e.target.value })}
            className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
            <input
                id="customerName" name="customerName"
                type="text"
                placeholder="Customer Name *"
                value={data.customerName}
                onChange={e => setData({ ...data, customerName: e.target.value })}
                className={inputClass}
            />
            <input
                id="customerPhone" name="customerPhone"
                type="text"
                placeholder="Customer Phone"
                value={data.customerPhone}
                onChange={e => setData({ ...data, customerPhone: e.target.value })}
                className={inputClass}
            />
        </div>
        <textarea
            id="problemDescription" name="problemDescription"
            placeholder="Problem Description"
            value={data.problemDescription}
            onChange={e => setData({ ...data, problemDescription: e.target.value })}
            className={inputClass + " resize-none h-20"}
        />
        <div className="grid grid-cols-2 gap-3">
            <select
                id="priority" name="priority"
                value={data.priority}
                onChange={e => setData({ ...data, priority: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm"
            >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
                id="status" name="status"
                value={data.status}
                onChange={e => setData({ ...data, status: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm"
            >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        <select
            id="technicianId" name="technicianId"
            value={data.technicianId}
            onChange={e => setData({ ...data, technicianId: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm"
        >
            <option value="">Assign Technician</option>
            {technicians.map(t => <option key={t.technicianId} value={t.technicianId}>{t.techName}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
            <input
                id="serviceCost" name="serviceCost"
                type="number"
                placeholder="Service Cost ($)"
                value={data.serviceCost}
                onChange={e => setData({ ...data, serviceCost: e.target.value })}
                className={inputClass}
            />
            <input
                id="partsUsed" name="partsUsed"
                type="text"
                placeholder="Parts Used"
                value={data.partsUsed}
                onChange={e => setData({ ...data, partsUsed: e.target.value })}
                className={inputClass}
            />
        </div>
    </div>
);
 
export default function RepairCenter() {
    const [repairs, setRepairs] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [editData, setEditData] = useState(null);
 
    useEffect(() => {
        Promise.allSettled([
            fetch('/api/repairs').then(r => r.json()),
            fetch('/api/technicians').then(r => r.json())
        ]).then(([repairsResult, techResult]) => {
            setRepairs(
                repairsResult.status === 'fulfilled' && Array.isArray(repairsResult.value)
                    ? repairsResult.value : []
            );
            setTechnicians(
                techResult.status === 'fulfilled' && Array.isArray(techResult.value)
                    ? techResult.value : []
            );
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
 
    const handleAdd = async () => {
        if (!formData.watchModel || !formData.customerName) {
            alert("Watch Model aur Customer Name required hai."); return;
        }
        const payload = {
            watchModel: formData.watchModel,
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            problemDescription: formData.problemDescription,
            priority: formData.priority,
            status: formData.status,
            serviceCost: parseFloat(formData.serviceCost) || 0,
            partsUsed: formData.partsUsed,
            technicianId: formData.technicianId ? parseInt(formData.technicianId) : null
        };
        const res = await fetch('/api/repairs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const added = await res.json();
            setRepairs(prev => [added, ...prev]);
            setShowAddForm(false);
            setFormData(emptyForm);
        } else alert("Add failed.");
    };
 
    const handleEditOpen = (r) => {
        setEditData({
            repairId: r.repairId,
            watchModel: r.watchModel || '',
            problemDescription: r.problemDescription || '',
            priority: r.priority || 'Normal',
            serviceCost: r.serviceCost || '',
            partsUsed: r.partsUsed || '',
            customerName: r.customerName || '',
            customerPhone: r.customerPhone || '',
            technicianId: r.technician?.technicianId || '',
            status: r.repairStatus || 'In Diagnosis'
        });
        setShowEditForm(true);
        setSelectedRepair(null);
    };
 
    const handleUpdate = async () => {
        // ✅ FIX: 'status' → 'repairStatus' same as handleAdd
        const { status, ...rest } = editData;
        const payload = {
            ...rest,
            repairStatus: status,
            serviceCost: parseFloat(editData.serviceCost) || 0,
            technicianId: editData.technicianId ? parseInt(editData.technicianId) : null
        };
        const res = await fetch(`/api/repairs/${editData.repairId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const updated = await res.json();
            setRepairs(prev => prev.map(r => r.repairId === updated.repairId ? updated : r));
            setShowEditForm(false);
        } else alert("Update failed.");
    };
 
    const handleDelete = async (id) => {
        if (!window.confirm("Is repair ticket ko delete karna chahte ho?")) return;
        const res = await fetch(`/api/repairs/${id}`, { method: 'DELETE' });
        if (res.ok || res.status === 204) {
            setRepairs(prev => prev.filter(r => r.repairId !== id));
            setSelectedRepair(null);
        }
    };
 
    const activeCount = repairs.filter(r => r.repairStatus !== 'Completed' && r.repairStatus !== 'Cancelled').length;
    const completedCount = repairs.filter(r => r.repairStatus === 'Completed').length;
    const criticalCount = repairs.filter(r => r.priority === 'Critical').length;
    const totalRevenue = repairs.filter(r => r.repairStatus === 'Completed').reduce((s, r) => s + (r.serviceCost || 0), 0);
 
    return (
        <div className="space-y-6 min-h-screen pb-12">
 
            {/* Header */}
            <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
                <div>
                    <p className="text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase mb-1 flex items-center gap-2">
                        <Wrench size={12} /> Repair Center
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-wider text-zinc-100 uppercase">Service Workspace</h1>
                    <p className="text-zinc-500 text-sm mt-1">{loading ? '...' : `${repairs.length} total repair tickets`}</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg"
                >
                    <Plus size={16} /> New Repair
                </button>
            </div>
 
            {/* Stats */}
            {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Active Repairs', value: activeCount, icon: <Clock size={14} /> },
                        { label: 'Completed', value: completedCount, icon: <CheckCircle size={14} /> },
                        { label: 'Critical', value: criticalCount, icon: <AlertTriangle size={14} /> },
                        { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign size={14} /> }
                    ].map(stat => (
                        <div key={stat.label} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">{stat.icon} {stat.label}</p>
                            <p className="text-2xl font-bold text-zinc-100 font-mono mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}
 
            {loading && (
                <div className="text-zinc-500 font-mono text-xs text-center py-16 animate-pulse">LOADING REPAIR TICKETS...</div>
            )}
 
            {/* Repair Cards */}
            {!loading && repairs.length === 0 && (
                <div className="text-center py-20 text-zinc-600 font-mono text-sm">NO REPAIR TICKETS — CREATE FIRST REQUEST</div>
            )}
 
            {!loading && repairs.map(r => (
                <div key={r.repairId} className="bg-[#0D0D0E] border border-zinc-900 hover:border-zinc-700 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all">
                    <div className="space-y-1 cursor-pointer flex-1" onClick={() => setSelectedRepair(r)}>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#D4AF37] font-bold font-mono text-xs">REP-{r.repairId}</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-200 font-bold text-sm">{r.watchModel}</span>
                            {r.priority && (
                                <span className={`px-2 py-0.5 rounded text-[10px] border font-mono ${priorityStyle(r.priority)}`}>
                                    {r.priority}
                                </span>
                            )}
                        </div>
                        <p className="text-zinc-500 text-xs">{r.problemDescription}</p>
                        <div className="flex gap-4 text-xs text-zinc-600 flex-wrap">
                            {r.customerName && <span className="flex items-center gap-1"><User size={10} /> {r.customerName}</span>}
                            {r.technician && <span className="flex items-center gap-1"><Wrench size={10} /> {r.technician.techName}</span>}
                            {r.serviceCost > 0 && <span className="flex items-center gap-1"><DollarSign size={10} /> ${r.serviceCost?.toLocaleString()}</span>}
                            {r.partsUsed && <span className="flex items-center gap-1"><Package size={10} /> {r.partsUsed}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2.5 py-1 rounded border font-mono uppercase ${statusStyle(r.repairStatus)}`}>
                            {r.repairStatus}
                        </span>
                        <button
                            onClick={() => handleEditOpen(r)}
                            className="bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 px-3 py-2 rounded-lg transition-all"
                        >
                            <Pencil size={12} />
                        </button>
                        <button
                            onClick={() => handleDelete(r.repairId)}
                            className="bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 px-3 py-2 rounded-lg transition-all"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>
            ))}
 
            {/* Detail Modal */}
            {selectedRepair && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRepair(null)}>
                    <div className="bg-[#0f0f12] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Repair Ticket</p>
                                <h2 className="text-xl font-bold text-white mt-1">REP-{selectedRepair.repairId}</h2>
                            </div>
                            <button onClick={() => setSelectedRepair(null)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            {[
                                ['Watch Model', selectedRepair.watchModel],
                                ['Customer', selectedRepair.customerName || '—'],
                                ['Phone', selectedRepair.customerPhone || '—'],
                                ['Technician', selectedRepair.technician?.techName || 'Unassigned'],
                                ['Status', selectedRepair.repairStatus],
                                ['Priority', selectedRepair.priority],
                                ['Service Cost', `$${selectedRepair.serviceCost?.toLocaleString() || 0}`],
                                ['Parts Used', selectedRepair.partsUsed || '—'],
                                ['Problem', selectedRepair.problemDescription || '—'],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between border-b border-zinc-900/60 pb-2">
                                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">{label}</span>
                                    <span className="text-zinc-200 text-xs text-right max-w-[60%]">{val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => handleEditOpen(selectedRepair)}
                                className="flex-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Pencil size={12} /> EDIT
                            </button>
                            <button
                                onClick={() => handleDelete(selectedRepair.repairId)}
                                className="flex-1 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Trash2 size={12} /> DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )}
 
            {/* Add Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
                    <div className="bg-[#0f0f12] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">New Ticket</p>
                                <h2 className="text-xl font-bold text-white mt-1">Repair Request</h2>
                            </div>
                            <button onClick={() => setShowAddForm(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <FormFields data={formData} setData={setFormData} technicians={technicians} />
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm"
                            >
                                CREATE TICKET
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold py-3 rounded-xl text-sm"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
 
            {/* Edit Modal */}
            {showEditForm && editData && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditForm(false)}>
                    <div className="bg-[#0f0f12] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Edit Ticket</p>
                                <h2 className="text-xl font-bold text-white mt-1">Update Repair</h2>
                            </div>
                            <button onClick={() => setShowEditForm(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <FormFields data={editData} setData={setEditData} technicians={technicians} />
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm"
                            >
                                UPDATE TICKET
                            </button>
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold py-3 rounded-xl text-sm"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}