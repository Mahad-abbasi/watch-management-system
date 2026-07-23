import { useState, useEffect } from 'react';
import { Plus, X, Eye, Package, Search, Filter, Pencil, Trash2 } from 'lucide-react';

const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white outline-none focus:border-[#D4AF37] text-sm transition-colors placeholder:text-zinc-600";
const selectClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white outline-none focus:border-[#D4AF37] text-sm transition-colors";

// ✅ FIX: WatchFormFields is OUTSIDE Inventory — fixes focus/keystroke bug
// brands aur categories props se aa rahe hain
const WatchFormFields = ({ data, setData, brands, categories }) => (
    <div className="space-y-3">
        <input
            type="text"
            placeholder="Model Name *"
            value={data.modelName}
            onChange={e => setData({ ...data, modelName: e.target.value })}
            className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
            <input
                type="number"
                placeholder="Price (USD) *"
                value={data.price}
                onChange={e => setData({ ...data, price: e.target.value })}
                className={inputClass}
            />
            <input
                type="number"
                placeholder="Stock Qty"
                value={data.stockQuantity}
                onChange={e => setData({ ...data, stockQuantity: e.target.value })}
                className={inputClass}
            />
        </div>
        <select
            value={data.brandId}
            onChange={e => setData({ ...data, brandId: e.target.value })}
            className={selectClass}
        >
            <option value="">Select Brand *</option>
            {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
        </select>
        <select
            value={data.categoryId}
            onChange={e => setData({ ...data, categoryId: e.target.value })}
            className={selectClass}
        >
            <option value="">Select Category *</option>
            {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
        </select>
        <input
            type="text"
            placeholder="Color"
            value={data.color}
            onChange={e => setData({ ...data, color: e.target.value })}
            className={inputClass}
        />
        <input
            type="text"
            placeholder="Image URL (optional)"
            value={data.imageUrl}
            onChange={e => setData({ ...data, imageUrl: e.target.value })}
            className={inputClass}
        />
    </div>
);

const brandImages = {
    'Rolex': 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400',
    'Patek Philippe': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
    'Audemars Piguet': 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400',
    'Omega': 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    'Cartier': 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=400',
    'Tag Heuer': 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400',
    'Hublot': 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400',
    'Vacheron Constantin': 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400',
    'Grand Seiko': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    'default': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
};

const emptyWatch = {
    modelName: '', color: '', price: '',
    stockQuantity: '', imageUrl: '', brandId: '', categoryId: ''
};

function Inventory() {
    const [watches, setWatches] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedWatch, setSelectedWatch] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editWatch, setEditWatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [newWatch, setNewWatch] = useState(emptyWatch);

    const getImage = (w) => w.imageUrl || brandImages[w.brand?.brandName] || brandImages['default'];

    useEffect(() => {
        Promise.all([
            fetch('/api/watches').then(r => { if (!r.ok) throw new Error('watches'); return r.json(); }),
            fetch('/api/brands').then(r => { if (!r.ok) throw new Error('brands'); return r.json(); }),
            fetch('/api/categories').then(r => { if (!r.ok) throw new Error('categories'); return r.json(); })
        ])
        .then(([watchData, brandData, categoryData]) => {
            // ✅ safe fallback — crash nahi hoga agar API fail ho
            setWatches(Array.isArray(watchData) ? watchData : []);
            setBrands(Array.isArray(brandData) ? brandData : []);
            setCategories(Array.isArray(categoryData) ? categoryData : []);
            setLoading(false);
        })
        .catch(err => { console.error("Load error:", err); setLoading(false); });
    }, []);

    // ADD
    const handleAddWatch = async () => {
        if (!newWatch.modelName || !newWatch.price || !newWatch.brandId || !newWatch.categoryId) {
            alert("Model, Price, Brand aur Category required hain.");
            return;
        }
        try {
            const response = await fetch('/api/watches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newWatch,
                    price: parseFloat(newWatch.price),
                    stockQuantity: parseInt(newWatch.stockQuantity) || 0,
                    brandId: parseInt(newWatch.brandId),
                    categoryId: parseInt(newWatch.categoryId)
                })
            });
            if (response.ok) {
                const added = await response.json();
                setWatches(prev => [added, ...prev]);
                setShowAddForm(false);
                setNewWatch(emptyWatch);
            } else {
                const err = await response.text();
                console.error("Backend error:", err);
                alert("Save failed — check backend logs.");
            }
        } catch (err) { console.error(err); alert("Backend chal raha hai?"); }
    };

    // EDIT OPEN
    const handleEditOpen = (w) => {
        setEditWatch({
            watchId: w.watchId,
            modelName: w.modelName || '',
            price: w.price || '',
            stockQuantity: w.stockQuantity || '',
            color: w.color || '',
            imageUrl: w.imageUrl || '',
            brandId: w.brand?.brandId || '',
            categoryId: w.category?.categoryId || ''
        });
        setShowEditForm(true);
        setSelectedWatch(null);
    };

    // UPDATE
    const handleUpdateWatch = async () => {
        if (!editWatch.modelName || !editWatch.price) {
            alert("Model aur Price required hain.");
            return;
        }
        try {
            const response = await fetch(`/api/watches/${editWatch.watchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modelName: editWatch.modelName,
                    price: parseFloat(editWatch.price),
                    stockQuantity: parseInt(editWatch.stockQuantity) || 0,
                    color: editWatch.color,
                    imageUrl: editWatch.imageUrl,
                    brandId: parseInt(editWatch.brandId),
                    categoryId: parseInt(editWatch.categoryId)
                })
            });
            if (response.ok) {
                const updated = await response.json();
                setWatches(prev => prev.map(w => w.watchId === updated.watchId ? updated : w));
                setShowEditForm(false);
                setEditWatch(null);
            } else {
                alert("Update failed — check backend.");
            }
        } catch (err) { console.error(err); alert("Backend error."); }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Is watch ko permanently delete karna chahte ho?")) return;
        try {
            const res = await fetch(`/api/watches/${id}`, { method: 'DELETE' });
            if (res.ok || res.status === 204) {
                setWatches(prev => prev.filter(w => w.watchId !== id));
                if (selectedWatch?.watchId === id) setSelectedWatch(null);
            } else {
                alert("Delete failed.");
            }
        } catch (err) { console.error(err); }
    };

    const filtered = watches.filter(w => {
        const matchSearch = w.modelName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchBrand = filterBrand === '' || w.brand?.brandName === filterBrand;
        return matchSearch && matchBrand;
    });

    const uniqueBrands = [...new Set(watches.map(w => w.brand?.brandName).filter(Boolean))];

    return (
        <div className="space-y-6 min-h-screen pb-12">

            {/* Header */}
            <div className="flex justify-between items-end border-b border-zinc-900/80 pb-6">
                <div>
                    <p className="text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase mb-1 flex items-center gap-2">
                        <Package size={12} /> Asset Registry
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-wider text-zinc-100 uppercase">Watch Inventory</h1>
                    <p className="text-zinc-500 text-sm mt-1">{loading ? '...' : `${watches.length} assets in registry`}</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg"
                >
                    <Plus size={16} /> Add Watch
                </button>
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search model name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37] transition-colors placeholder:text-zinc-600"
                    />
                </div>
                <div className="relative">
                    <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select
                        value={filterBrand}
                        onChange={e => setFilterBrand(e.target.value)}
                        className="bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-8 py-2.5 text-white text-sm outline-none focus:border-[#D4AF37] appearance-none"
                    >
                        <option value="">All Brands</option>
                        {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
            </div>

            {/* Stats */}
            {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Models', value: watches.length },
                        { label: 'Total Stock', value: watches.reduce((s, w) => s + (w.stockQuantity || 0), 0) },
                        { label: 'Brands', value: uniqueBrands.length },
                        { label: 'Avg Price', value: `$${watches.length ? Math.round(watches.reduce((s, w) => s + (w.price || 0), 0) / watches.length).toLocaleString() : 0}` }
                    ].map(stat => (
                        <div key={stat.label} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-bold text-zinc-100 font-mono mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {loading && (
                <div className="text-zinc-500 font-mono text-xs text-center py-16 animate-pulse">LOADING ASSET REGISTRY...</div>
            )}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-20 text-zinc-600 font-mono text-sm">
                    {searchTerm || filterBrand ? 'NO MATCHES FOUND' : 'NO ASSETS — ADD YOUR FIRST WATCH'}
                </div>
            )}

            {/* Grid */}
            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(w => (
                        <div key={w.watchId}
                            className="group bg-[#111112]/60 border border-zinc-900 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-44 bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => setSelectedWatch(w)}>
                                <img src={getImage(w)} alt={w.modelName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={e => { e.target.src = brandImages['default']; }} />
                                <div className="absolute top-2 right-2 bg-black/80 border border-zinc-800 text-[9px] font-mono text-zinc-400 px-2 py-0.5 rounded-full">
                                    QTY: {w.stockQuantity}
                                </div>
                                <div className="absolute top-2 left-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[9px] font-mono text-[#D4AF37] px-2 py-0.5 rounded-full">
                                    {w.brand?.brandName || '—'}
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <h3 className="text-sm font-bold text-zinc-100 truncate">{w.modelName}</h3>
                                <p className="text-xs text-zinc-600 font-mono truncate">{w.sku}</p>
                                <p className="text-base font-bold text-[#D4AF37] font-mono">${w.price?.toLocaleString()}</p>
                                <div className="flex gap-2 pt-1">
                                    <button onClick={() => setSelectedWatch(w)}
                                        className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs py-2 rounded-lg transition-all">
                                        <Eye size={11} /> Inspect
                                    </button>
                                    <button onClick={() => handleEditOpen(w)}
                                        className="flex items-center justify-center bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 px-3 py-2 rounded-lg transition-all">
                                        <Pencil size={11} />
                                    </button>
                                    <button onClick={() => handleDelete(w.watchId)}
                                        className="flex items-center justify-center bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 px-3 py-2 rounded-lg transition-all">
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Inspect Modal */}
            {selectedWatch && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedWatch(null)}>
                    <div className="bg-[#0f0f12] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Asset Detail</p>
                                <h2 className="text-lg font-bold text-white mt-1">{selectedWatch.modelName}</h2>
                            </div>
                            <button onClick={() => setSelectedWatch(null)} className="text-zinc-500 hover:text-white transition"><X size={20} /></button>
                        </div>
                        <img src={getImage(selectedWatch)} alt={selectedWatch.modelName}
                            className="w-full h-48 object-cover rounded-xl mb-5 border border-zinc-800"
                            onError={e => { e.target.src = brandImages['default']; }} />
                        <div className="space-y-2.5 font-mono text-sm">
                            {[
                                ['Watch ID', `#${selectedWatch.watchId}`],
                                ['Model', selectedWatch.modelName],
                                ['Brand', selectedWatch.brand?.brandName || '—'],
                                ['Category', selectedWatch.category?.categoryName || '—'],
                                ['SKU', selectedWatch.sku],
                                ['Serial No', selectedWatch.serialNumber],
                                ['Price', `$${selectedWatch.price?.toLocaleString()}`],
                                ['Stock', `${selectedWatch.stockQuantity} Units`],
                                ['Color', selectedWatch.color || '—'],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between border-b border-zinc-900/60 pb-2">
                                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">{label}</span>
                                    <span className="text-zinc-200 text-xs">{val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => handleEditOpen(selectedWatch)}
                                className="flex-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/40 text-blue-400 font-mono text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                <Pencil size={12} /> EDIT ASSET
                            </button>
                            <button onClick={() => handleDelete(selectedWatch.watchId)}
                                className="flex-1 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 font-mono text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2">
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
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">New Entry</p>
                                <h2 className="text-xl font-bold text-white mt-1">Register Asset</h2>
                            </div>
                            <button onClick={() => setShowAddForm(false)} className="text-zinc-500 hover:text-white transition"><X size={20} /></button>
                        </div>
                        {/* ✅ brands aur categories props se pass ho rahe hain */}
                        <WatchFormFields
                            data={newWatch}
                            setData={setNewWatch}
                            brands={brands}
                            categories={categories}
                        />
                        <p className="text-[10px] text-zinc-600 font-mono mt-3">* Required fields</p>
                        <div className="flex gap-3 mt-5">
                            <button onClick={handleAddWatch}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm transition-all">
                                SAVE ASSET
                            </button>
                            <button onClick={() => setShowAddForm(false)}
                                className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-bold py-3 rounded-xl text-sm transition-all">
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditForm && editWatch && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditForm(false)}>
                    <div className="bg-[#0f0f12] border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Edit Asset</p>
                                <h2 className="text-xl font-bold text-white mt-1">Update Watch</h2>
                            </div>
                            <button onClick={() => setShowEditForm(false)} className="text-zinc-500 hover:text-white transition"><X size={20} /></button>
                        </div>
                        {/* ✅ brands aur categories props se pass ho rahe hain */}
                        <WatchFormFields
                            data={editWatch}
                            setData={setEditWatch}
                            brands={brands}
                            categories={categories}
                        />
                        <div className="flex gap-3 mt-5">
                            <button onClick={handleUpdateWatch}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-3 rounded-xl text-sm transition-all">
                                UPDATE ASSET
                            </button>
                            <button onClick={() => setShowEditForm(false)}
                                className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-bold py-3 rounded-xl text-sm transition-all">
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;