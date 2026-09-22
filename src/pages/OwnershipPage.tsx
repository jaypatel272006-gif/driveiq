import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { calculateOwnershipCost } from '../services/calculators';
import { Calculator, Fuel, ShieldCheck, DollarSign, ArrowRight, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const OwnershipPage: React.FC = () => {
  const [selectedCarId, setSelectedCarId] = useState<string>(CARS_DATA[0].id);
  const [annualKm, setAnnualKm] = useState<number>(15000);
  const [yearsOwned, setYearsOwned] = useState<number>(5);

  const car = CARS_DATA.find(c => c.id === selectedCarId) || CARS_DATA[0];
  const purchasePriceRs = (car.startingPriceLakhs + 2.0) * 100000;

  const tco = calculateOwnershipCost(car, purchasePriceRs, annualKm, yearsOwned);

  const chartData = [
    { category: 'Purchase Price', Cost: tco.purchasePriceRs / 100000 },
    { category: 'Fuel/Energy', Cost: tco.totalFuelCostRs / 100000 },
    { category: 'Maintenance', Cost: tco.totalMaintenanceRs / 100000 },
    { category: 'Insurance', Cost: tco.totalInsuranceRs / 100000 },
    { category: 'Taxes/RTO', Cost: tco.totalTaxesRs / 100000 },
    { category: 'Resale Credit', Cost: (tco.depreciatedResaleRs / 100000) * -1 }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" /> Total Cost of Ownership (TCO) Engine
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Total Ownership Cost Calculator</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Calculate real-world 3-year, 5-year, and 7-year ownership expenditure including fuel, insurance, annual servicing, registration taxes, and depreciated resale value.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Target Vehicle:</label>
            <select
              value={selectedCarId}
              onChange={e => setSelectedCarId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
            >
              {CARS_DATA.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Starts ₹{c.startingPriceLakhs}L)</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Annual Driving Distance:</span>
              <span className="text-emerald-400 font-bold">{annualKm.toLocaleString()} km/yr</span>
            </div>
            <input
              type="range"
              min={5000}
              max={35000}
              step={1000}
              value={annualKm}
              onChange={e => setAnnualKm(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Ownership Period:</label>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              {[3, 5, 7].map(yr => (
                <button
                  key={yr}
                  onClick={() => setYearsOwned(yr)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    yearsOwned === yr ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {yr} Years
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* TCO Results Banner & Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Net Total Ownership Cost ({yearsOwned} Years)
            </span>

            <div className="text-4xl sm:text-5xl font-black text-white font-mono">
              ₹{tco.netOwnershipCostRs.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 font-sans block mt-1">
                Effective cost after subtracting {yearsOwned}-year depreciated resale value (₹{(tco.depreciatedResaleRs / 100000).toFixed(2)} Lakhs)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-center">
              <div>
                <span className="text-slate-500 block">COST PER KM</span>
                <span className="text-emerald-400 font-bold">₹{tco.costPerKmRs} / km</span>
              </div>
              <div>
                <span className="text-slate-500 block">MONTHLY COST</span>
                <span className="text-cyan-400 font-bold">₹{tco.monthlyCostRs.toLocaleString()} / mo</span>
              </div>
              <div>
                <span className="text-slate-500 block">TOTAL FUEL</span>
                <span className="text-amber-400 font-bold">₹{tco.totalFuelCostRs.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Table & Recharts */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {yearsOwned}-Year Cost Component Breakdown (Lakhs)
            </h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="Cost" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
