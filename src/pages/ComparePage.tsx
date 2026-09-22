import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { useApp } from '../context/AppContext';
import { compareVehicles } from '../services/comparisonEngine';
import { GitCompare, Trophy, Plus, X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VehicleImage } from '../components/ui/VehicleImage';

export const ComparePage: React.FC = () => {
  const { compareIds, toggleCompare, clearCompare, userProfile } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    compareIds.length > 0 ? compareIds : ['hyundai-creta', 'kia-seltos', 'maruti-grand-vitara']
  );

  const selectedVehicles = selectedIds.map(id => CARS_DATA.find(c => c.id === id)).filter(Boolean) as typeof CARS_DATA;

  const analysis = compareVehicles(selectedVehicles, userProfile);

  const handleAddCar = (carId: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(carId)) {
      setSelectedIds([...selectedIds, carId]);
    }
  };

  const handleRemoveCar = (carId: string) => {
    setSelectedIds(selectedIds.filter(id => id !== carId));
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-7 h-7 text-cyan-400" />
            Intelligent Vehicle Comparison
          </h1>
          <p className="text-xs text-slate-400">Head-to-head comparison of up to 3 vehicles with category winner determination.</p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={() => setSelectedIds([])}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            Clear Selected Cars
          </button>
        )}
      </div>

      {/* Vehicle Selector Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map(slotIdx => {
          const car = selectedVehicles[slotIdx];

          if (car) {
            return (
              <div key={car.id} className="glass-card p-4 rounded-3xl border border-slate-800 relative space-y-3">
                <button
                  onClick={() => handleRemoveCar(car.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-800">
                  <VehicleImage src={car.images.hero || car.image} alt={car.name} />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono">{car.brand}</span>
                  <h3 className="text-lg font-black text-white">{car.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">₹{car.startingPriceLakhs}L – ₹{car.maxPriceLakhs}L</p>
                </div>
              </div>
            );
          }

          return (
            <div key={slotIdx} className="glass-panel p-6 rounded-3xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-500">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400">Add Vehicle #{slotIdx + 1}</span>
              <select
                onChange={e => e.target.value && handleAddCar(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>Select Car...</option>
                {CARS_DATA.filter(c => !selectedIds.includes(c.id)).map(c => (
                  <option key={c.id} value={c.id}>{c.name} (₹{c.startingPriceLakhs}L)</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* AI VERDICT BANNER */}
      {selectedVehicles.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> AI Comparison Verdict
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {analysis.aiVerdict}
          </p>
        </div>
      )}

      {/* CATEGORY WINNERS GRID */}
      {analysis.winners.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Category Winners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.winners.map((w, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  {w.category} Winner 🏆
                </span>
                <h4 className="text-base font-bold text-white">{w.winningVehicleName}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{w.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPARISON SPECIFICATIONS MATRIX TABLE */}
      {selectedVehicles.length > 0 && (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="p-4 font-bold text-slate-400 uppercase tracking-wider w-48">Specification</th>
                {selectedVehicles.map(v => (
                  <th key={v.id} className="p-4 font-black text-white text-sm">
                    {v.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Starting Price</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-emerald-400 font-bold">₹{v.startingPriceLakhs} Lakhs</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Body Type</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-white">{v.bodyType}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Fuel Powertrains</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-cyan-400">{v.fuelTypes.join(', ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Transmissions</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-white">{v.transmissions.join(', ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">NCAP Safety Rating</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-amber-400 font-bold">{v.ncapRating}-Star ({v.ncapTestAgency})</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Ground Clearance</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-white">{v.groundClearanceMm} mm</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Boot Capacity</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-white">{v.bootSpaceLiters} Liters</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Power Output</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-white font-bold">{v.variants[0]?.powerBhp || 'N/A'} PS</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Torque Output</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-white">{v.variants[0]?.torqueNm || 'N/A'} Nm</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Fuel Efficiency / Range</td>
                {selectedVehicles.map(v => {
                  const m = v.variants[0]?.mileageKmpl || 16;
                  return (
                    <td key={v.id} className="p-4 text-cyan-400 font-bold">
                      {m > 100 ? `${m} km Range` : `${m} km/l`}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Level-2 ADAS Tech</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4">
                    {v.variants.some(varItem => varItem.hasADAS) ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">Available</span>
                    ) : (
                      <span className="text-slate-500 font-sans">Unavailable</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Panoramic / Sunroof</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4">
                    {v.variants.some(varItem => varItem.hasSunroof) ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">Available</span>
                    ) : (
                      <span className="text-slate-500 font-sans">Unavailable</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Ventilated Seats</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4">
                    {v.variants.some(varItem => varItem.hasVentilatedSeats) ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">Available</span>
                    ) : (
                      <span className="text-slate-500 font-sans">Unavailable</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Annual Maintenance</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-emerald-400">~₹{v.annualMaintenanceEstRs.toLocaleString()}/yr</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">Factory Warranty</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-white">{v.warrantyYears} Yrs / {v.warrantyKm.toLocaleString()} km</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-400 font-bold font-sans">5-Year Resale Value</td>
                {selectedVehicles.map(v => (
                  <td key={v.id} className="p-4 text-cyan-400 font-bold">{v.resaleValue5YrPercent}% Retention</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
