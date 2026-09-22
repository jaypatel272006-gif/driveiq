import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { predictResaleValue } from '../services/calculators';
import { DollarSign, TrendingDown, Info, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ResalePage: React.FC = () => {
  const [selectedCarId, setSelectedCarId] = useState<string>(CARS_DATA[0].id);
  const [annualKm, setAnnualKm] = useState<number>(12000);
  const [condition, setCondition] = useState<number>(1.0); // 1.05 Excellent, 1.0 Good, 0.9 Fair

  const car = CARS_DATA.find(c => c.id === selectedCarId) || CARS_DATA[0];
  const purchasePriceLakhs = car.startingPriceLakhs + 2.0;

  const curveData = predictResaleValue(car, purchasePriceLakhs, annualKm, condition);

  const yr5Val = curveData.find(c => c.year === 5)!;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
          <DollarSign className="w-3.5 h-3.5" /> Depreciation Intelligence Engine
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">7-Year Resale Value Predictor</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Model vehicle market depreciation over 7 years based on Indian resale demand trends, annual driving distance, and vehicle condition.
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
                <option key={c.id} value={c.id}>{c.name} (Resale Score: {c.resaleScore}/100)</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Expected Annual KM:</span>
              <span className="text-cyan-400 font-bold">{annualKm.toLocaleString()} km/yr</span>
            </div>
            <input
              type="range"
              min={6000}
              max={25000}
              step={1000}
              value={annualKm}
              onChange={e => setAnnualKm(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Vehicle Condition:</label>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              {[
                { label: 'Excellent', val: 1.05 },
                { label: 'Good', val: 1.0 },
                { label: 'Fair', val: 0.9 }
              ].map(cond => (
                <button
                  key={cond.label}
                  onClick={() => setCondition(cond.val)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    condition === cond.val ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Output Curve */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-slate-950/80 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Estimated 5-Year Resale Value
            </span>

            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              ₹{yr5Val.minEstimatedValueLakhs}L – ₹{yr5Val.maxEstimatedValueLakhs}L
              <span className="text-xs font-normal text-slate-400 font-sans block mt-1">
                Retains ~{yr5Val.retentionPercentage}% of purchase price (₹{purchasePriceLakhs}L) after 5 years.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Estimated value — not a guaranteed resale price. Actual trade-in values depend on local market demand.</span>
            </div>
          </div>

          {/* Recharts Depreciation Curve Line Chart */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              7-Year Value Retention Curve (₹ Lakhs)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="estimatedValueLakhs" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
