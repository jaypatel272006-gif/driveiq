import React from 'react';
import { CARS_DATA } from '../data/cars';
import { ShieldCheck, CheckCircle, Info, Lock, Zap } from 'lucide-react';
import { ScoreRing } from '../components/ui/ScoreRing';

export const SafetyPage: React.FC = () => {
  const sortedSafetyCars = [...CARS_DATA].sort((a, b) => b.safetyScore - a.safetyScore);

  const safetyDictionary = [
    { name: 'Level-2 ADAS', desc: 'Autonomous Emergency Braking, Lane Keep Assist, Adaptive Cruise Control, and Forward Collision Warning.' },
    { name: 'Global / Bharat NCAP', desc: 'Official crash test assessments evaluating adult occupant & child occupant protection during frontal & side impacts.' },
    { name: 'Electronic Stability Control (ESC)', desc: 'Prevents skidding during sudden emergency evasive maneuvers by automatically braking individual wheels.' },
    { name: 'ISOFIX Child Seat Mounts', desc: 'Standardized rigid anchor points for securing infant child safety seats directly to car chassis.' }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> Safety Intelligence Dashboard
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Vehicle Safety & Crash Rating Ratings</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Verified GNCAP & Bharat NCAP crash protection scores, airbag standards, structural integrity assessments, and ADAS active safety technologies.
        </p>
      </div>

      {/* SAFETY DICTIONARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {safetyDictionary.map((item, idx) => (
          <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> {item.name}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* VEHICLES SAFETY RANKINGS LIST */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white">Vehicle Safety Leaderboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedSafetyCars.map(car => (
            <div key={car.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">{car.brand}</span>
                  <h3 className="text-xl font-black text-white">{car.name}</h3>
                  <span className="text-xs text-amber-400 font-bold font-mono">
                    {car.ncapRating}-Star Safety ({car.ncapTestAgency})
                  </span>
                </div>
                <ScoreRing score={car.safetyScore} size={60} strokeWidth={6} color="#3b82f6" label="Safety" />
              </div>

              <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded-2xl" />

              {/* Safety Features Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{car.variants[0]?.airbagCount || 6} Airbags Standard</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ESC & Hill Hold Assist</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${car.variants.some(v => v.hasADAS) ? 'bg-blue-950/40 border-blue-500/40 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Level-2 ADAS {car.variants.some(v => v.hasADAS) ? 'Available' : 'N/A'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ISOFIX Child Mounts</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
