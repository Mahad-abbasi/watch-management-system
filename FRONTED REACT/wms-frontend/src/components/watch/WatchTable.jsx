import React from "react";

const WatchTable = ({ watches = [], onInspect }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50">
      <table className="w-full text-left text-sm text-neutral-300">
        <thead className="bg-neutral-900 text-xs uppercase tracking-wider text-amber-500 border-b border-neutral-800">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Model Name</th>
            <th className="p-4">Brand</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {watches.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-8 text-center text-neutral-500 text-xs uppercase tracking-wide">
                No active metrics found in Time Sphere database.
              </td>
            </tr>
          ) : (
            watches.map((watch) => (
              <tr key={watch.id || watch.watchId} className="hover:bg-neutral-900/80 transition">
                <td className="p-4 font-mono text-amber-600/70">#{watch.id || watch.watchId}</td>
                <td className="p-4 font-bold text-white">{watch.modelName}</td>
                <td className="p-4 text-neutral-400">{watch.brand}</td>
                <td className="p-4 text-amber-500 font-medium">{watch.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${watch.stockQuantity > 0 ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>
                    {watch.stockQuantity} units
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onInspect(watch.id || watch.watchId)}
                    className="border border-neutral-700 hover:border-amber-500 hover:text-amber-500 px-3 py-1 rounded text-xs font-bold transition"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WatchTable;