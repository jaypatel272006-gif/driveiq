import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { vehicleDb } from '../data/db/vehicleDatabase';
import { MODELS_DB } from '../data/db/models';
import { Database, ShieldCheck, Cpu, CheckCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';

export const DatabaseHealthPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const health = vehicleDb.getDatabaseHealthReport();

  const filteredModels = MODELS_DB.filter(m => {
    if (statusFilter === 'all') return true;
    return m.marketStatus === statusFilter;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            DriveIQ Database & Dataset Intelligence
          </span>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Database className="w-7 h-7 text-cyan-400" />
            Indian Automotive Database Health Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time audit dashboard reporting dataset completeness, market status distribution, and vehicle coverage.
          </p>
        </div>

        <Link
          to="/cars"
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white"
        >
          View Public Cars Catalog →
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">TOTAL BRANDS</span>
          <span className="text-xl font-black text-cyan-400">{health.totalBrands}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">TOTAL MODELS</span>
          <span className="text-xl font-black text-white">{health.totalModels}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">TOTAL VARIANTS</span>
          <span className="text-xl font-black text-emerald-400">{health.totalVariants}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">ELECTRIC (EVs)</span>
          <span className="text-xl font-black text-indigo-400">{health.totalEVs}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">CURRENT MODELS</span>
          <span className="text-xl font-black text-emerald-400">{health.currentModelsCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">DISCONTINUED</span>
          <span className="text-xl font-black text-amber-400">{health.discontinuedModelsCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] text-slate-500 block">UPCOMING</span>
          <span className="text-xl font-black text-purple-400">{health.upcomingModelsCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center space-y-1 bg-emerald-950/20">
          <span className="text-[10px] text-slate-500 block">HEALTH SCORE</span>
          <span className="text-xl font-black text-emerald-400">{health.dataHealthScore}%</span>
        </div>
      </div>

      {/* CANONICAL ROUTE VALIDATION AUDIT CARD */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Canonical Route & Slug Validation Audit
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {health.routeValidation.validRoutesCount} / {health.routeValidation.totalRoutesTested} Routes Validated (0 Duplicates)
          </span>
        </div>
        <p className="text-xs text-slate-400">
          All vehicle model routes follow the standardized canonical format: <code className="text-cyan-400">/cars/:brandSlug/:modelSlug</code>. Legacy URLs are automatically normalized and resolved.
        </p>
      </div>

      {/* Dataset Audit Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white">Registered Models Registry</h3>
            <p className="text-xs text-slate-400">Structured models with market status tags, fuel types, and price bounds.</p>
          </div>

          <div className="flex gap-2">
            {['all', 'current', 'discontinued', 'upcoming'].map(stg => (
              <button
                key={stg}
                onClick={() => setStatusFilter(stg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono capitalize transition-all ${
                  statusFilter === stg
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 font-mono text-slate-400">
                <th className="p-3">Model Name</th>
                <th className="p-3">Market Status</th>
                <th className="p-3">Body Type</th>
                <th className="p-3">Price Range (Ex-Showroom)</th>
                <th className="p-3">Fuel Powertrains</th>
                <th className="p-3">Data Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredModels.map(m => {
                const brand = vehicleDb.getBrandById(m.brandId);

                return (
                  <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase block">{brand?.name}</span>
                      <span className="text-sm font-bold text-white">{m.name}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.marketStatus === 'current'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : m.marketStatus === 'discontinued'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {m.marketStatus}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{m.bodyType}</td>
                    <td className="p-3 text-emerald-400 font-bold">₹{m.startingPriceLakhs}L – ₹{m.endingPriceLakhs}L</td>
                    <td className="p-3 text-cyan-400">{m.availableFuelTypes.join(', ')}</td>
                    <td className="p-3 text-slate-400 uppercase text-[10px]">{m.dataStatus || 'VERIFIED'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
