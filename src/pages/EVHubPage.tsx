import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { calculateFuelComparison } from '../services/calculators';
import { Zap, ShieldCheck, BatteryCharging, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';

export const EVHubPage: React.FC = () => {
  const [monthlyKm, setMonthlyKm] = useState<number>(1500);
  const [electricityRate, setElectricityRate] = useState<number>(8.5);
  const [petrolPrice, setPetrolPrice] = useState<number>(96.7);

  const evCars = CARS_DATA.filter(c => c.fuelTypes.includes('Electric'));

  const fuelComp = calculateFuelComparison(monthlyKm, petrolPrice, 89.6, 76.5, electricityRate);
  const evData = fuelComp.find(f => f.fuelType.includes('Electric'))!;
  const petrolData = fuelComp.find(f => f.fuelType === 'Petrol')!;

  const monthlySavings = petrolData.monthlyCostRs - evData.monthlyCostRs;
  const fiveYearSavings = petrolData.fiveYearCostRs - evData.fiveYearCostRs;

  const chartData = [
    { period: '1 Year', EV: evData.annualCostRs, Petrol: petrolData.annualCostRs },
    { period: '3 Years', EV: evData.threeYearCostRs, Petrol: petrolData.threeYearCostRs },
    { period: '5 Years', EV: evData.fiveYearCostRs, Petrol: petrolData.fiveYearCostRs },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" /> Electric Vehicle Intelligence Hub
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          EV Range & <span className="gradient-text-cyan">Lifetime Savings Engine</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Discover electric SUVs & hatchbacks, model home vs public charging economics, and calculate exact fuel cost savings over 5 years.
        </p>
      </div>

      {/* EV SAVINGS CALCULATOR SECTION */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-cyan-400" />
            EV vs Petrol Savings Calculator
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Monthly Kilometres:</span>
              <span className="text-cyan-400 font-bold">{monthlyKm} km/mo</span>
            </div>
            <input
              type="range"
              min={500}
              max={4000}
              step={100}
              value={monthlyKm}
              onChange={e => setMonthlyKm(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">EV Tariff (₹/kWh):</label>
              <input
                type="number"
                step="0.5"
                value={electricityRate}
                onChange={e => setElectricityRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-cyan-400 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Petrol Price (₹/L):</label>
              <input
                type="number"
                step="0.5"
                value={petrolPrice}
                onChange={e => setPetrolPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-amber-400 font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Savings Metric Box */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1 font-mono">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Estimated 5-Year Fuel Savings</span>
            <div className="text-3xl font-black text-emerald-300">
              ₹{fiveYearSavings.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-300 block font-sans">
              Saves ~₹{monthlySavings.toLocaleString()} every month in running costs.
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="lg:col-span-7 bg-slate-950/80 p-4 sm:p-6 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
            Accumulated Fuel Cost Comparison (₹)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="period" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="EV" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Petrol" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ELECTRIC VEHICLES DISCOVERY */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white">Electric Vehicles in Database</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evCars.map(car => (
            <div key={car.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <img src={car.image} alt={car.name} className="w-full h-48 object-cover rounded-2xl" />
                
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase font-mono">{car.brand}</span>
                  <h3 className="text-xl font-black text-white">{car.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">₹{car.startingPriceLakhs}L – ₹{car.maxPriceLakhs}L</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block">SAFETY</span>
                    <span className="text-emerald-400 font-bold">{car.ncapRating}-Star</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">MAINTENANCE</span>
                    <span className="text-cyan-400 font-bold">~₹4.5k/yr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">BOOT</span>
                    <span className="text-white font-bold">{car.bootSpaceLiters}L</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{car.overview}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link to={`/cars/${car.id}`} className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                  Full Specs & Battery Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
