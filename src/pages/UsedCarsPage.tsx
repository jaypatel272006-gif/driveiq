import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { Calculator, ShieldCheck, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

export const UsedCarsPage: React.FC = () => {
  const [selectedCarId, setSelectedCarId] = useState<string>(CARS_DATA[0].id);
  const [usedAgeYears, setUsedAgeYears] = useState<number>(3);

  const car = CARS_DATA.find(c => c.id === selectedCarId) || CARS_DATA[0];
  const newPriceLakhs = car.startingPriceLakhs + 2.5; // mid variant

  // Calculations for New vs Used
  // Used price ~ 35% lower at 3 yrs
  const usedPriceLakhs = Number((newPriceLakhs * (1 - (usedAgeYears * 0.11))).toFixed(2));
  const priceSavingsLakhs = Number((newPriceLakhs - usedPriceLakhs).toFixed(2));

  // 5-Year Maintenance: Used car maintenance is ~50% higher
  const new5YrMaintRs = car.annualMaintenanceEstRs * 5;
  const used5YrMaintRs = Math.round(car.annualMaintenanceEstRs * 1.55 * 5);

  // 5-Year Depreciation: New car loses ~45%, Used car loses ~25% of its purchase price over 5 yrs
  const new5YrDepreciationRs = Math.round(newPriceLakhs * 100000 * 0.45);
  const used5YrDepreciationRs = Math.round(usedPriceLakhs * 100000 * 0.28);

  const totalNetNewCostRs = Math.round((newPriceLakhs * 100000 * 0.12) + new5YrDepreciationRs + new5YrMaintRs);
  const totalNetUsedCostRs = Math.round((usedPriceLakhs * 100000 * 0.08) + used5YrDepreciationRs + used5YrMaintRs);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" /> Financial Verdict Engine
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Should You Buy New or Used?</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Compare 5-year financial depreciation, warranty coverage, maintenance risks, and resale retention between a new car and a {usedAgeYears}-year-old used counterpart.
        </p>
      </div>

      {/* Control Inputs */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Target Vehicle:</label>
          <select
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
          >
            {CARS_DATA.map(c => (
              <option key={c.id} value={c.id}>{c.name} (New Price ~₹{c.startingPriceLakhs + 2.5}L)</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-mono">
            <span>Used Car Age:</span>
            <span className="text-purple-400 font-bold">{usedAgeYears} Years Old</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={usedAgeYears}
            onChange={e => setUsedAgeYears(Number(e.target.value))}
            className="w-full accent-purple-400"
          />
        </div>
      </div>

      {/* NEW VS USED SIDE-BY-SIDE MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BRAND NEW CAR */}
        <div className="glass-card p-6 rounded-3xl border border-cyan-500/40 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Option A</span>
            <span className="text-lg font-black text-white">Brand New {car.name}</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Initial Outlay:</span>
              <span className="text-white font-bold">₹{newPriceLakhs} Lakhs</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">5-Year Depreciation Loss:</span>
              <span className="text-amber-400">₹{new5YrDepreciationRs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">5-Year Maintenance:</span>
              <span className="text-emerald-400">₹{new5YrMaintRs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Factory Warranty:</span>
              <span className="text-emerald-400 font-bold">3 Years / 100,000 km</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Full factory warranty peace of mind & latest tech trim</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Zero hidden mechanical defects or accident history risk</span>
            </div>
          </div>
        </div>

        {/* USED CAR */}
        <div className="glass-card p-6 rounded-3xl border border-purple-500/40 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">Option B</span>
            <span className="text-lg font-black text-white">{usedAgeYears}-Yr Old Used {car.name}</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Initial Outlay:</span>
              <span className="text-emerald-400 font-bold">₹{usedPriceLakhs} Lakhs (Saves ₹{priceSavingsLakhs}L)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">5-Year Depreciation Loss:</span>
              <span className="text-emerald-400">₹{used5YrDepreciationRs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">5-Year Maintenance:</span>
              <span className="text-amber-400">₹{used5YrMaintRs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Factory Warranty:</span>
              <span className="text-amber-400">Expired / Extended Only</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Significantly lower upfront capital commitment</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Requires thorough mechanic inspection & wear-and-tear repairs</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI VERDICT */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          DriveIQ AI Financial Verdict
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          If your priority is **maximum financial savings**, buying a {usedAgeYears}-year-old used {car.name} saves you upfront **₹{priceSavingsLakhs} Lakhs**, while suffering lower subsequent depreciation. However, if you drive **&gt;1,500 km/month** and value zero mechanical stress with 3-year factory warranty, buying **Brand New** justifies the premium.
        </p>
      </div>

    </div>
  );
};
