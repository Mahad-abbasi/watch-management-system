import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, Pencil, Trash2, DollarSign, Clock, CheckCircle, Package } from 'lucide-react';

const STATUSES = ["Processing", "Settled", "Cancelled", "Refunded"];

const statusStyle = (s) => {
    if (s === "Settled") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (s === "Processing") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (s === "Cancelled") return "text-zinc-500 bg-zinc-800 border-zinc-700";
    if (s === "Refunded") return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    return "text-zinc-400 bg-zinc-800 border-zinc-700";
};

const emptyForm = {
    customerId: '',
    watchId: '',
    quantity: 1,
    unitPrice: '',
    status: 'Processing'
};

const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm transition-colors placeholder:text-zinc-600";
const selectClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37] text-sm transition-colors";

// ✅ Form OUTSIDE component — focus bug nahi hoga
const OrderFormFields = ({ data, setData, customers, watches }) => (
    <div className="space-y-3">
        <select
            value={data.customerId}
            onChange={e => setData({ ...data, customerId: e.target.value })}
            className={selectClass}
        >
            <option value="">Select Customer *</option>
            {customers.map(c => (
                <option key={c.customerId} value={c.customerId}>{c.fullName || c.name}</option>
            ))}
        </select>
        <select
            value={data.watchId}
            onChange={e => setData({ ...data, watchId: e.target.value })}
            className={selectClass}
        >
            <option value="">Select Watch *</option>
            {watches.map(w => (
                <option key={w.watchId} value={w.watchId}>{w.modelName} — ${w.price?.toLocaleString()}</option>
            ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
            <input
                type="number"
                placeholder="Quantity *"
                value={data.quantity}
                onChange={e => setData({ ...data, quantity: e.target.value })}
                className={inputClass}
                min="1"
            />
            <input
                type="number"
                placeholder="Unit Price (USD) *"
                value={data.unitPrice}
                onChange={e => setData({ ...data, unitPrice: e.target.value })}
                className={inputClass}
            />
        </div>
        <select
            value={data.status}
            onChange={e => setData({ ...data, status: e.target.value })}
            className={selectClass}
        >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
    </div>
);

export default function OrdersSales() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch('/api/orders').then(r => r.json()),
            fetch('/api/customers').then(r => r.json()),
            fetch('/api/watches').then(r => r.json()),
        ]).then(([orderData, customerData, watchData]) => {
            setOrders(Array.isArray(orderData) ? orderData : []);
            setCustomers(Array.isArray(customerData) ? customerData : []);
            setWatches(Array.isArray(watchData) ? watchData : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleAdd = async () => {
        if (!formData.customerId || !formData.watchId || !formData.unitPrice) {
            alert("Customer, Watch aur Unit Price required hain."); return;
        }
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerId: parseInt(formData.customerId),
                items: [{
                    watchId: parseInt(formData.watchId),
                    quantity: parseInt(formData.quantity) || 1,
                    unitPrice: parseFloat(formData.unitPrice)
                }]
            })
        });
        if (res.ok) {
            const added = await res.json();
            setOrders(prev => [added, ...prev]);
            setShowAddForm(false);
            setFormData(emptyForm);
        } else alert("Order save nahi hua — backend check karo.");
    };

    const handleEditOpen = (o) => {
        setEditData({
            orderId: o.orderId,
            customerId: o.customer?.customerId || '',
            watchId: o.orderItems?.[0]?.watch?.watchId || '',
            quantity: o.orderItems?.[0]?.quantity || 1,
            unitPrice: o.orderItems?.[0]?.unitPrice || o.totalAmount || '',
            status: o.status || 'Processing'
        });
        setShowEditForm(true);
        setSelectedOrder(null);
    };

    const handleUpdate = async () => {
        const res = await fetch(`/api/orders/${editData.orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerId: parseInt(editData.customerId),
                status: editData.status,
                items: [{
                    watchId: parseInt(editData.watchId),
                    quantity: parseInt(editData.quantity) || 1,
                    unitPrice: parseFloat(editData.unitPrice)
                }]
            })
        });
        if (res.ok) {
            const updated = await res.json();
            setOrders(prev => prev.map(o => o.orderId === updated.orderId ? updated : o));
            setShowEditForm(false);
        } else alert("Update failed.");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Is order ko delete karna chahte ho?")) return;
        const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
        if (res.ok || res.status === 204) {
            setOrders(prev => prev.filter(o => o.orderId !== id));
            setSelectedOrder(null);
        } else alert("Delete failed.");
    };

    // Stats
    const settledOrders = orders.filter(o => o.status === 'Settled');
    const totalRevenue = settledOrders.reduce((s, o) => s + (parseFloat(o.totalAmount) || 0), 0);
    const processingCount = orders.filter(o => o.status === 'Processing').length;

    return (
        <div className="space-y-6 min-h-screen pb-12">

            {/* ✅ Header — same style as other sections */}
            <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
                <div>
                    <p className="text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase mb-1 flex items-center gap-2">
                        <ShoppingBag size={12} /> Sales Ledger
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-wider text-zinc-100 uppercase">Orders & Sales</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        {loading ? '...' : `${orders.length} total transactions`}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg"
                >
                    <Plus size={16} /> New Order
                </button>
            </div>

            {/* Stats */}
            {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Orders', value: orders.length, icon: <Package size={14} /> },
                        { label: 'Settled', value: settledOrders.length, icon: <CheckCircle size={14} /> },
                        { label: 'Processing', value: processingCount, icon: <Clock size={14} /> },
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
                <div className="text-zinc-500 font-mono text-xs text-center py-16 animate-pulse">LOADING ORDERS...</div>
            )}

            {!loading && orders.length === 0 && (
                <div className="text-center py-20 text-zinc-600 font-mono text-sm">NO ORDERS — CREATE FIRST TRANSACTION</div>
            )}

            {/* Orders Table */}
            {!loading && orders.length > 0 && (
                <div className="bg-[#0D0D0E] border border-zinc-900 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-900 bg-zinc-950/40 text-zinc-500 text-[10px] uppercase tracking-wider font-mono">
                                <th className="p-4">Transaction ID</th>
                                <th className="p-4">Counterparty</th>
                                <th className="p-4">Asset Acquired</th>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4 text-right">Value (USD)</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr
                                    key={o.orderId}
                                    className="border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors cursor-pointer"
                                    onClick={() => setSelectedOrder(o)}
                                >
                                    <td className="p-4 text-[#D4AF37] font-bold font-mono text-xs">
                                        TXN-{o.orderId}
                                    </td>
                                    <td className="p-4 text-zinc-200 text-sm">
                                        {o.customer?.fullName || o.customer?.name || '—'}
                                    </td>
                                    <td className="p-4 text-zinc-400 text-sm">
                                        {o.orderItems?.[0]?.watch?.modelName || '—'}
                                    </td>
                                    <td className="p-4 text-zinc-500 font-mono text-xs">
                                        {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-CA') : '—'}
                                    </td>
                                    <td className="p-4 text-right font-bold text-zinc-100 font-mono">
                                        ${parseFloat(o.totalAmount || 0).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] border font-mono ${statusStyle(o.status)}`}>
                                            {o.status || 'Processing'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditOpen(o)}
                                                className="bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                <Pencil size={11} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(o.orderId)}
                                                className="bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-[#0f0f12] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Transaction Detail</p>
                                <h2 className="text-xl font-bold text-white mt-1">TXN-{selectedOrder.orderId}</h2>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            {[
                                ['Customer', selectedOrder.customer?.fullName || selectedOrder.customer?.name || '—'],
                                ['Watch', selectedOrder.orderItems?.[0]?.watch?.modelName || '—'],
                                ['Quantity', selectedOrder.orderItems?.[0]?.quantity || '—'],
                                ['Unit Price', `$${parseFloat(selectedOrder.orderItems?.[0]?.unitPrice || 0).toLocaleString()}`],
                                ['Total Amount', `$${parseFloat(selectedOrder.totalAmount || 0).toLocaleString()}`],
                                ['Status', selectedOrder.status || '—'],
                                ['Date', selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-CA') : '—'],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between border-b border-zinc-900/60 pb-2">
                                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">{label}</span>
                                    <span className="text-zinc-200 text-xs text-right">{val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => handleEditOpen(selectedOrder)}
                                className="flex-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Pencil size={12} /> EDIT
                            </button>
                            <button
                                onClick={() => handleDelete(selectedOrder.orderId)}
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
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">New Transaction</p>
                                <h2 className="text-xl font-bold text-white mt-1">Create Order</h2>
                            </div>
                            <button onClick={() => setShowAddForm(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <OrderFormFields
                            data={formData}
                            setData={setFormData}
                            customers={customers}
                            watches={watches}
                        />
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm"
                            >
                                PLACE ORDER
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
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Edit Order</p>
                                <h2 className="text-xl font-bold text-white mt-1">Update Transaction</h2>
                            </div>
                            <button onClick={() => setShowEditForm(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <OrderFormFields
                            data={editData}
                            setData={setEditData}
                            customers={customers}
                            watches={watches}
                        />
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm"
                            >
                                UPDATE ORDER
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