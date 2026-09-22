import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { matchVehicleVariant, DesiredFeatureSelection } from '../services/variantMatcher';
import { Sliders, Check, X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VariantsPage: React.FC = () => {
  const [selectedCarId, setSelectedCarId] = useState<string>(CARS_DATA[0].id);
  const [desires, setDesires] = useState<DesiredFeatureSelection>({
    sunroof: true,
    adas: false,
    ventilatedSeats: false,
    camera360: false,
    wirelessCharger: true,
    autoAC: true,
    automatic: true
  });
  const [targetBudget, setTargetBudget] = useState<number>(16);

  const car = CARS_DATA.find(c => c.id === selectedCarId) || CARS_DATA[0];
  const matchResult = matchVehicleVariant(car, desires, targetBudget);

  const toggleFeature = (key: keyof DesiredFeatureSelection) => {
    setDesires(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5" /> Exact Variant Matcher
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Find Your Exact Trim Variant</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Select your target vehicle and check your must-have features. DriveIQ evaluates every trim variant to recommend the best-value choice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vehicle & Feature Selector */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Select Vehicle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Select Vehicle:
            </label>
            <select
              value={selectedCarId}
              onChange={e => setSelectedCarId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
            >
              {CARS_DATA.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} (₹{c.startingPriceLakhs}L – ₹{c.maxPriceLakhs}L)
                </option>
              ))}
            </select>
          </div>

          {/* Budget Limit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Target Budget Limit:</span>
              <span className="text-cyan-400 font-bold">₹{targetBudget} Lakhs</span>
            </div>
            <input
              type="range"
              min={8}
              max={28}
              step={1}
              value={targetBudget}
              onChange={e => setTargetBudget(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Must-Have Features Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Check Must-Have Features:
            </label>

            <div className="space-y-2 text-xs">
              {[
                { key: 'automatic', label: 'Automatic Transmission' },
                { key: 'sunroof', label: 'Panoramic / Electric Sunroof' },
                { key: 'adas', label: 'Level-2 ADAS Tech' },
                { key: 'ventilatedSeats', label: 'Ventilated Front Seats' },
                { key: 'camera360', label: '360 Surround View Camera' },
                { key: 'wirelessCharger', label: 'Wireless Phone Charging' },
                { key: 'autoAC', label: 'Automatic Climate Control' }
              ].map(f => (
                <label
                  key={f.key}
                  onClick={() => toggleFeature(f.key as keyof DesiredFeatureSelection)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    desires[f.key as keyof DesiredFeatureSelection]
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>{f.label}</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    desires[f.key as keyof DesiredFeatureSelection] ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                  }`}>
                    {desires[f.key as keyof DesiredFeatureSelection] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Variant Recommendation Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Primary Recommended Variant Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 space-y-6">
            
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Recommended Variant Trim ({matchResult.matchScore}% Match)
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                ₹{matchResult.recommendedVariant.priceLakhs} Lakhs
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{car.name}</span>
              <h2 className="text-2xl font-black text-white">{matchResult.recommendedVariant.name}</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {matchResult.recommendedVariant.powerBhp} PS • {matchResult.recommendedVariant.torqueNm} Nm • {matchResult.recommendedVariant.transmission} ({matchResult.recommendedVariant.fuel})
              </p>
            </div>

            {/* Why Recommended */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
              <span className="text-emerald-400 font-bold uppercase block mb-1">Algorithmic Rationale:</span>
              {matchResult.whyRecommended}
            </div>

            {/* Included & Missing Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider">Included Features ({matchResult.includedFeatures.length})</h4>
                <ul className="space-y-1 text-slate-300">
                  {matchResult.includedFeatures.map((inc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {matchResult.missingFeatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider">Missing Features ({matchResult.missingFeatures.length})</h4>
                  <ul className="space-y-1 text-slate-400">
                    {matchResult.missingFeatures.map((mis, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{mis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Alternatives Grid (Cheapest & Fully Loaded) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {matchResult.cheapestAlternative && (
              <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Cheaper Alternative
                </span>
                <h4 className="text-base font-bold text-white">{matchResult.cheapestAlternative.name}</h4>
                <p className="text-sm font-bold text-emerald-400 font-mono">₹{matchResult.cheapestAlternative.priceLakhs} Lakhs</p>
                <p className="text-xs text-slate-400">Budget-friendly entry trim into {car.name} range.</p>
              </div>
            )}

            {matchResult.fullyLoadedAlternative && (
              <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Fully-Loaded Alternative
                </span>
                <h4 className="text-base font-bold text-white">{matchResult.fullyLoadedAlternative.name}</h4>
                <p className="text-sm font-bold text-cyan-400 font-mono">₹{matchResult.fullyLoadedAlternative.priceLakhs} Lakhs</p>
                <p className="text-xs text-slate-400">Top-of-the-line flagship trim with all features unlocked.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
