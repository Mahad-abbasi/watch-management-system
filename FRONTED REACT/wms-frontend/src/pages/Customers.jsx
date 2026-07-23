import { useState, useEffect } from 'react';
import { Users, Shield, Search, Mail, Phone, Plus, X, Pencil, Trash2, Star } from 'lucide-react';

const TIERS = ["Gold Tier", "Platinium Elite", "Centurion Black", "Diamond Allocation"];

const tierStyle = (tier) => {
    if (tier === "Diamond Allocation") return "bg-cyan-950/40 text-cyan-400 border-cyan-900/50";
    if (tier === "Centurion Black") return "bg-zinc-950/60 text-zinc-300 border-zinc-800";
    if (tier === "Platinium Elite") return "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30";
    return "bg-emerald-950/40 text-emerald-400 border-emerald-900/50";
};

const emptyForm = { fullName: '', emailAddress: '', phoneCoordinates: '', location: '', tier: 'Gold Tier', loyaltyPoints: 0 };

const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm transition-colors placeholder:text-zinc-600";

// ✅ FormFields OUTSIDE component (focus bug fix)
// ✅ All inputs have id + name (autofill warning fix)
const FormFields = ({ data, setData }) => (
    <div className="space-y-3">
        <input
            id="fullName" name="fullName"
            type="text" placeholder="Full Name *"
            value={data.fullName}
            onChange={e => setData({ ...data, fullName: e.target.value })}
            className={inputClass}
        />
        <input
            id="emailAddress" name="emailAddress"
            type="email" placeholder="Email Address *"
            value={data.emailAddress}
            onChange={e => setData({ ...data, emailAddress: e.target.value })}
            className={inputClass}
        />
        <input
            id="phoneCoordinates" name="phoneCoordinates"
            type="text" placeholder="Phone Number"
            value={data.phoneCoordinates}
            onChange={e => setData({ ...data, phoneCoordinates: e.target.value })}
            className={inputClass}
        />
        <input
            id="location" name="location"
            type="text" placeholder="Location (City, Country)"
            value={data.location}
            onChange={e => setData({ ...data, location: e.target.value })}
            className={inputClass}
        />
        <select
            id="tier" name="tier"
            value={data.tier}
            onChange={e => setData({ ...data, tier: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm"
        >
            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
            id="loyaltyPoints" name="loyaltyPoints"
            type="number" placeholder="Loyalty Points"
            value={data.loyaltyPoints}
            onChange={e => setData({ ...data, loyaltyPoints: parseInt(e.target.value) || 0 })}
            className={inputClass}
        />
    </div>
);

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        fetch('/api/customers')
            .then(r => r.json())
            .then(data => { setCustomers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = async () => {
        if (!formData.fullName || !formData.emailAddress) {
            alert("Name aur Email required hain."); return;
        }
        const res = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            const added = await res.json();
            setCustomers(prev => [added, ...prev]);
            setShowAddForm(false);
            setFormData(emptyForm);
        } else alert("Add failed.");
    };

    const handleEditOpen = (c) => {
        setEditData({
            customerId: c.customerId,
            fullName: c.fullName || '',
            emailAddress: c.emailAddress || '',
            phoneCoordinates: c.phoneCoordinates || '',
            location: c.location || '',
            tier: c.tier || 'Gold Tier',
            loyaltyPoints: c.loyaltyPoints || 0
        });
        setShowEditForm(true);
        setSelectedCustomer(null);
    };

    const handleUpdate = async () => {
        const res = await fetch(`/api/customers/${editData.customerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData)
        });
        if (res.ok) {
            const updated = await res.json();
            setCustomers(prev => prev.map(c => c.customerId === updated.customerId ? updated : c));
            setShowEditForm(false);
        } else alert("Update failed.");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Is customer ko delete karna chahte ho?")) return;
        const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        if (res.ok || res.status === 204) {
            setCustomers(prev => prev.filter(c => c.customerId !== id));
            setSelectedCustomer(null);
        } else alert("Delete failed.");
    };

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Header */}
            <header className="flex justify-between items-end border-b border-zinc-900 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase mb-1">
                        <Users size={12} /> Relationship Matrix
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-500 bg-clip-text text-transparent uppercase">
                        Customer CRM Registry
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">{loading ? '...' : `${customers.length} collectors in registry`}</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input
                            id="searchTerm" name="searchTerm"
                            type="text" placeholder="Search collector profiles..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#111112] border border-zinc-900 rounded-lg pl-9 pr-4 py-1.5 text-xs font-mono text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-700"
                        />
                    </div>
                    <button onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold px-4 py-2 rounded-xl text-sm transition-all">
                        <Plus size={14} /> Add Client
                    </button>
                </div>
            </header>

            {/* Stats */}
            {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Clients', value: customers.length },
                        { label: 'Total Loyalty Pts', value: customers.reduce((s, c) => s + (c.loyaltyPoints || 0), 0).toLocaleString() },
                        { label: 'Diamond Tier', value: customers.filter(c => c.tier === 'Diamond Allocation').length },
                        { label: 'Avg Loyalty Pts', value: customers.length ? Math.round(customers.reduce((s, c) => s + (c.loyaltyPoints || 0), 0) / customers.length) : 0 }
                    ].map(stat => (
                        <div key={stat.label} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-bold text-zinc-100 font-mono mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {loading && <div className="text-zinc-500 font-mono text-xs text-center py-16 animate-pulse">LOADING CRM REGISTRY...</div>}

            {/* Table */}
            {!loading && (
                <div className="border border-zinc-900 bg-[#111112]/30 rounded-xl overflow-hidden">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-zinc-900 bg-zinc-950/40 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                                <th className="p-4 pl-6">Collector ID</th>
                                <th className="p-4">Identity Details</th>
                                <th className="p-4">Tier Status</th>
                                <th className="p-4 text-right">Loyalty Pts</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/60 text-sm font-mono">
                            {filtered.map(c => (
                                <tr key={c.customerId} className="hover:bg-zinc-900/20 group transition-colors cursor-pointer">
                                    <td className="p-4 pl-6 font-bold text-[#D4AF37] text-xs tracking-wider"
                                        onClick={() => setSelectedCustomer(c)}>
                                        VIP-{c.customerId}
                                    </td>
                                    <td className="p-4" onClick={() => setSelectedCustomer(c)}>
                                        <div className="flex flex-col">
                                            <span className="text-zinc-200 font-bold">{c.fullName}</span>
                                            <span className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1"><Mail size={11} /> {c.emailAddress}</span>
                                            {c.phoneCoordinates && <span className="text-zinc-600 text-xs flex items-center gap-1"><Phone size={11} /> {c.phoneCoordinates}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] px-2.5 py-0.5 rounded border font-medium uppercase tracking-wider inline-flex items-center gap-1 ${tierStyle(c.tier)}`}>
                                            <Shield size={10} /> {c.tier}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-[#D4AF37] font-bold">
                                        <span className="flex items-center justify-end gap-1"><Star size={11} /> {c.loyaltyPoints}</span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => handleEditOpen(c)}
                                                className="bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1">
                                                <Pencil size={11} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(c.customerId)}
                                                className="bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1">
                                                <Trash2 size={11} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && !loading && (
                        <div className="text-center py-16 text-zinc-600 font-mono text-sm">NO CLIENTS FOUND</div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCustomer(null)}>
                    <div className="bg-[#0f0f12] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Client Profile</p>
                                <h2 className="text-xl font-bold text-white mt-1">{selectedCustomer.fullName}</h2>
                                <span className={`text-[10px] px-2.5 py-0.5 rounded border font-medium uppercase tracking-wider inline-flex items-center gap-1 mt-2 ${tierStyle(selectedCustomer.tier)}`}>
                                    <Shield size={10} /> {selectedCustomer.tier}
                                </span>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            {[
                                ['Client ID', `VIP-${selectedCustomer.customerId}`],
                                ['Email', selectedCustomer.emailAddress],
                                ['Phone', selectedCustomer.phoneCoordinates || '—'],
                                ['Location', selectedCustomer.location || '—'],
                                ['Loyalty Points', selectedCustomer.loyaltyPoints || 0],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between border-b border-zinc-900/60 pb-2">
                                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">{label}</span>
                                    <span className="text-zinc-200 text-xs">{val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => handleEditOpen(selectedCustomer)}
                                className="flex-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-2">
                                <Pencil size={12} /> EDIT
                            </button>
                            <button onClick={() => handleDelete(selectedCustomer.customerId)}
                                className="flex-1 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-2">
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
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">New Client</p>
                                <h2 className="text-xl font-bold text-white mt-1">Register Client</h2>
                            </div>
                            <button onClick={() => setShowAddForm(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <FormFields data={formData} setData={setFormData} />
                        <div className="flex gap-3 mt-5">
                            <button onClick={handleAdd}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm">
                                SAVE CLIENT
                            </button>
                            <button onClick={() => setShowAddForm(false)}
                                className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold py-3 rounded-xl text-sm">
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
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Edit Client</p>
                                <h2 className="text-xl font-bold text-white mt-1">Update Profile</h2>
                            </div>
                            <button onClick={() => setShowEditForm(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <FormFields data={editData} setData={setEditData} />
                        <div className="flex gap-3 mt-5">
                            <button onClick={handleUpdate}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm">
                                UPDATE CLIENT
                            </button>
                            <button onClick={() => setShowEditForm(false)}
                                className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold py-3 rounded-xl text-sm">
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}