import React, { useState } from 'react';
import { CARS_DATA } from '../data/cars';
import { calculateEMI } from '../services/calculators';
import { DollarSign, CheckCircle, AlertCircle, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const FinancePage: React.FC = () => {
  const [carPriceLakhs, setCarPriceLakhs] = useState<number>(15);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.8);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [userMonthlyIncome, setUserMonthlyIncome] = useState<number>(120000);

  const carPriceRs = carPriceLakhs * 100000;
  const downPaymentRs = Math.round((carPriceRs * downPaymentPercent) / 100);

  const emiResult = calculateEMI(carPriceRs, downPaymentRs, interestRate, tenureMonths, userMonthlyIncome);

  // Compare 3, 5, 7 Year Tenures
  const emi3Yr = calculateEMI(carPriceRs, downPaymentRs, interestRate, 36, userMonthlyIncome);
  const emi5Yr = calculateEMI(carPriceRs, downPaymentRs, interestRate, 60, userMonthlyIncome);
  const emi7Yr = calculateEMI(carPriceRs, downPaymentRs, interestRate, 84, userMonthlyIncome);

  const pieData = [
    { name: 'Loan Principal', value: emiResult.loanAmountRs, color: '#06b6d4' },
    { name: 'Total Interest', value: emiResult.totalInterestRs, color: '#f59e0b' }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
          <DollarSign className="w-3.5 h-3.5" /> Finance & Loan EMI Studio
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Car Loan EMI & Affordability Studio</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Model loan tenures, interest rates, down payments, and evaluate monthly income affordability indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Preset Car Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Load Car Price Preset:</label>
            <select
              onChange={e => e.target.value && setCarPriceLakhs(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none"
            >
              {CARS_DATA.map(c => (
                <option key={c.id} value={c.startingPriceLakhs}>{c.name} (~₹{c.startingPriceLakhs}L)</option>
              ))}
            </select>
          </div>

          {/* Car Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Vehicle On-Road Price:</span>
              <span className="text-amber-400 font-bold">₹{carPriceLakhs} Lakhs</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={0.5}
              value={carPriceLakhs}
              onChange={e => setCarPriceLakhs(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Down Payment % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Down Payment ({downPaymentPercent}%):</span>
              <span className="text-emerald-400 font-bold">₹{(downPaymentRs / 100000).toFixed(2)} Lakhs</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={e => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Annual Interest Rate:</span>
              <span className="text-cyan-400 font-bold">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min={7.0}
              max={14.0}
              step={0.1}
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Loan Tenure */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Loan Tenure:</label>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              {[36, 60, 84].map(m => (
                <button
                  key={m}
                  onClick={() => setTenureMonths(m)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    tenureMonths === m ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {m / 12} Years ({m}M)
                </button>
              ))}
            </div>
          </div>

          {/* User Monthly Income */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Your Monthly Income (Optional):
            </label>
            <input
              type="number"
              step="5000"
              value={userMonthlyIncome}
              onChange={e => setUserMonthlyIncome(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono font-bold focus:outline-none"
            />
          </div>

        </div>

        {/* Right Column: Output Metrics & Charts */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main EMI Metric Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Monthly Loan EMI
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                emiResult.affordabilityStatus === 'Comfortable'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : emiResult.affordabilityStatus === 'Stretch'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                Affordability: {emiResult.affordabilityStatus}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white font-mono">
              ₹{emiResult.monthlyEmiRs.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 font-sans block mt-1">
                Per month for {tenureMonths / 12} years ({tenureMonths} months)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">LOAN AMOUNT:</span>
                <span className="text-cyan-400 font-bold">₹{emiResult.loanAmountRs.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">TOTAL INTEREST:</span>
                <span className="text-amber-400 font-bold">₹{emiResult.totalInterestRs.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">TOTAL REPAYMENT:</span>
                <span className="text-white font-bold">₹{emiResult.totalRepaymentRs.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Principal vs Interest Pie Chart */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <h4 className="font-bold text-white font-sans uppercase tracking-wider">Loan Repayment Breakdown</h4>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold">● Principal Loan:</span>
                <span className="text-white">₹{emiResult.loanAmountRs.toLocaleString()} ({emiResult.principalRatioPercent}%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold">● Interest Cost:</span>
                <span className="text-white">₹{emiResult.totalInterestRs.toLocaleString()} ({100 - emiResult.principalRatioPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Tenure Comparison Grid (3 vs 5 vs 7 Years) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Tenure Comparison (3 Yrs vs 5 Yrs vs 7 Yrs)
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
              {[
                { label: '3 Years (36M)', data: emi3Yr },
                { label: '5 Years (60M)', data: emi5Yr },
                { label: '7 Years (84M)', data: emi7Yr }
              ].map((t, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.label}</span>
                  <span className="text-sm font-black text-white block">₹{t.data.monthlyEmiRs.toLocaleString()}/mo</span>
                  <span className="text-[10px] text-amber-400 block">Interest: ₹{(t.data.totalInterestRs / 100000).toFixed(2)}L</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
