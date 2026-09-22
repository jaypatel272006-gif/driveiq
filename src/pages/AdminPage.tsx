import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Plus, Edit, Trash2, CheckCircle, Database } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { testDrives } = useApp();
  const [vehicles, setVehicles] = useState(CARS_DATA);
  const [activeTab, setActiveTab] = useState<'cars' | 'testDrives'>('cars');

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Protected Admin Portal
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Automotive Data Management</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'cars' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('testDrives')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'testDrives' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Test Drives ({testDrives.length})
          </button>
        </div>
      </div>

      {activeTab === 'cars' && (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Vehicle Catalogue Registry
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">● Local Persistence Synced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Body</th>
                  <th className="p-3">Price Range</th>
                  <th className="p-3">NCAP Safety</th>
                  <th className="p-3">Variants</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {vehicles.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <img src={v.image} alt={v.name} className="w-8 h-6 rounded object-cover" />
                      {v.name}
                    </td>
                    <td className="p-3 text-slate-300">{v.bodyType}</td>
                    <td className="p-3 text-emerald-400">₹{v.startingPriceLakhs}L – ₹{v.maxPriceLakhs}L</td>
                    <td className="p-3 text-amber-400">{v.ncapRating}-Star</td>
                    <td className="p-3 text-cyan-400">{v.variants.length} Trims</td>
                    <td className="p-3">
                      <button className="text-xs text-slate-400 hover:text-white underline mr-2">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'testDrives' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Dealer Enquiry & Test Drive Bookings
          </h3>

          {testDrives.length > 0 ? (
            <div className="space-y-3 font-mono text-xs">
              {testDrives.map(td => (
                <div key={td.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{td.carName} ({td.variantName})</h4>
                    <p className="text-slate-400">{td.name} • {td.phone} • {td.email}</p>
                    <p className="text-cyan-400 font-bold mt-1">Slot: {td.preferredDate} @ {td.preferredTime} ({td.city})</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    {td.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">
              <p className="text-xs">No test drives booked yet.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
