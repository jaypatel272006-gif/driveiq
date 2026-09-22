import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CARS_DATA } from '../data/cars';
import { rankVehicles } from '../services/recommendationEngine';
import { UserProfile, FuelType, TransmissionType, BootRequirement, PriorityCategory, Vehicle } from '../types/car';
import { RecommendationCard } from '../components/finder/RecommendationCard';
import { WhyThisCarModal } from '../components/finder/WhyThisCarModal';
import {
  Sliders,
  DollarSign,
  Fuel,
  Gauge,
  Navigation,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FinderPage: React.FC = () => {
  const { userProfile, updateProfile } = useApp();

  const [step, setStep] = useState<number>(1);
  const [profile, setProfileState] = useState<UserProfile>(userProfile);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedWhyCar, setSelectedWhyCar] = useState<Vehicle | null>(null);

  // Available Priorities for Step 7
  const allPriorities: PriorityCategory[] = [
    'Safety',
    'Mileage',
    'Performance',
    'Comfort',
    'Features',
    'Space',
    'Reliability',
    'Maintenance',
    'Resale',
    'Looks',
    'Driving Experience',
    'Technology'
  ];

  // Move priority up in list
  const movePriorityUp = (index: number) => {
    if (index === 0) return;
    const updated = [...profile.priorities];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setProfileState({ ...profile, priorities: updated });
  };

  // Move priority down in list
  const movePriorityDown = (index: number) => {
    if (index === profile.priorities.length - 1) return;
    const updated = [...profile.priorities];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setProfileState({ ...profile, priorities: updated });
  };

  // Slider change handler ensuring totals remain 100%
  const handleUsageChange = (field: 'cityPercentage' | 'highwayPercentage', value: number) => {
    if (field === 'cityPercentage') {
      const city = value;
      const highway = 100 - city;
      setProfileState({ ...profile, cityPercentage: city, highwayPercentage: highway, hillsPercentage: 0 });
    } else {
      const highway = value;
      const city = 100 - highway;
      setProfileState({ ...profile, cityPercentage: city, highwayPercentage: highway, hillsPercentage: 0 });
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    updateProfile(profile);

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // Ranked Results
  const rankedResults = rankVehicles(CARS_DATA, profile);
  const topMatches = rankedResults.slice(0, 5);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          DriveIQ Multi-Factor Matching Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Find Your <span className="gradient-text-cyan">Perfect Vehicle Match</span>
        </h1>
        <p className="text-sm text-slate-400">
          Answer 7 quick lifestyle questions. Our deterministic algorithm scores every car variant on budget, running costs, safety, and priority weights.
        </p>
      </div>

      {/* Progress Bar */}
      {!showResults && (
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>STEP {step} OF 7</span>
            <span>{Math.round((step / 7) * 100)}% COMPLETED</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 7) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Wizard Form Area */}
      {!showResults && (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
        >
          {/* STEP 1: BUDGET */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Target On-Road Budget</h3>
                  <p className="text-xs text-slate-400">What is your maximum target budget for your new car?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[8, 12, 15, 20, 25, 30].map(b => (
                  <button
                    key={b}
                    onClick={() => setProfileState({ ...profile, budgetLakhs: b })}
                    className={`p-4 rounded-2xl text-center border font-bold transition-all ${
                      profile.budgetLakhs === b
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    ₹{b} Lakhs
                  </button>
                ))}
              </div>

              {/* Custom Budget Slider */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Custom Budget:</span>
                  <span className="text-cyan-400 font-bold text-sm">₹{profile.budgetLakhs} Lakhs</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={45}
                  step={1}
                  value={profile.budgetLakhs}
                  onChange={e => setProfileState({ ...profile, budgetLakhs: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          )}

          {/* STEP 2: FUEL */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Fuel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Fuel Preference</h3>
                  <p className="text-xs text-slate-400">Select your preferred fuel type or powertrain.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric', "Doesn't matter"] as FuelType[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setProfileState({ ...profile, fuelPreference: f })}
                    className={`p-4 rounded-2xl text-center border font-bold transition-all ${
                      profile.fuelPreference === f
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: TRANSMISSION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Transmission Preference</h3>
                  <p className="text-xs text-slate-400">Do you prefer manual gear-shifting or stress-free automatic?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['Manual', 'Any Automatic', 'CVT', 'DCT', 'Torque Converter', "Doesn't matter"] as TransmissionType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setProfileState({ ...profile, transmissionPreference: t })}
                    className={`p-4 rounded-2xl text-center border font-bold transition-all ${
                      profile.transmissionPreference === t
                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: USAGE SLIDERS */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">City vs Highway Usage Split</h3>
                  <p className="text-xs text-slate-400">Adjust the sliders to reflect your expected driving environment.</p>
                </div>
              </div>

              <div className="space-y-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span>City Traffic Commute:</span>
                    <span className="text-cyan-400 font-bold">{profile.cityPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={profile.cityPercentage}
                    onChange={e => handleUsageChange('cityPercentage', Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span>Highway Road Trips:</span>
                    <span className="text-emerald-400 font-bold">{profile.highwayPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={profile.highwayPercentage}
                    onChange={e => handleUsageChange('highwayPercentage', Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: MONTHLY KM */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Monthly Driving Distance</h3>
                  <p className="text-xs text-slate-400">How many kilometres do you expect to drive per month?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[500, 1000, 1500, 2000, 3000].map(km => (
                  <button
                    key={km}
                    onClick={() => setProfileState({ ...profile, monthlyKm: km })}
                    className={`p-4 rounded-2xl text-center border font-bold transition-all ${
                      profile.monthlyKm === km
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {km} km / month
                  </button>
                ))}
              </div>

              {/* Custom KM Slider */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Custom Distance:</span>
                  <span className="text-amber-400 font-bold text-sm">{profile.monthlyKm} km/mo</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={5000}
                  step={100}
                  value={profile.monthlyKm}
                  onChange={e => setProfileState({ ...profile, monthlyKm: Number(e.target.value) })}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* STEP 6: FAMILY & BOOT */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Family Size & Boot Capacity</h3>
                  <p className="text-xs text-slate-400">How many family members travel together and how much luggage room is required?</p>
                </div>
              </div>

              {/* Family Size */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Family Size:
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[2, 4, 5, 7].map(num => (
                    <button
                      key={num}
                      onClick={() => setProfileState({ ...profile, familySize: num })}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        profile.familySize === num
                          ? 'bg-purple-500 text-white border-purple-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-200'
                      }`}
                    >
                      {num === 7 ? '6 – 7' : num === 2 ? '1 – 2' : num === 4 ? '3 – 4' : '5'} Persons
                    </button>
                  ))}
                </div>
              </div>

              {/* Boot Requirement */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Boot Space Requirement:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['Small', 'Medium', 'Large', 'Very Large'] as BootRequirement[]).map(b => (
                    <button
                      key={b}
                      onClick={() => setProfileState({ ...profile, bootRequirement: b })}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        profile.bootRequirement === b
                          ? 'bg-purple-500 text-white border-purple-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PRIORITY RANKING */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Rank Your Priorities</h3>
                  <p className="text-xs text-slate-400">Order your priorities from top (#1) to lowest. Highest priorities receive maximum weight in the matching score.</p>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {profile.priorities.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold font-mono text-xs ${
                        idx === 0 ? 'bg-emerald-500 text-slate-950' : idx === 1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white">{item}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => movePriorityUp(idx)}
                        disabled={idx === 0}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-mono"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => movePriorityDown(idx)}
                        disabled={idx === profile.priorities.length - 1}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-mono"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 7 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="px-8 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-cyan-500/30"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating Vehicle Fit Scores...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze & Generate Top Matches →
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* RESULTS DISPLAY AREA */}
      {showResults && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Active Profile Summary Banner */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Active User Profile Context
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                ₹{profile.budgetLakhs}L Budget • {profile.fuelPreference} • {profile.transmissionPreference}
              </h3>
              <p className="text-xs text-slate-400">
                {profile.monthlyKm} km/mo ({profile.cityPercentage}% City) • Family of {profile.familySize} • Top Priority: {profile.priorities[0]}
              </p>
            </div>
            <button
              onClick={() => {
                setShowResults(false);
                setStep(1);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/60 flex items-center gap-2 shrink-0"
            >
              <Sliders className="w-4 h-4" /> Edit Answers & Re-Analyze
            </button>
          </div>

          {/* Top 5 Recommendation Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Your Top Vehicle Matches
            </h2>

            {topMatches.map((result, idx) => (
              <RecommendationCard
                key={result.vehicle.id}
                result={result}
                rank={idx + 1}
                onWhyThisCarClick={() => setSelectedWhyCar(result.vehicle)}
              />
            ))}
          </div>

        </div>
      )}

      {/* Signature "Why This Car?" Modal */}
      <WhyThisCarModal
        vehicle={selectedWhyCar}
        profile={profile}
        onClose={() => setSelectedWhyCar(null)}
      />

    </div>
  );
};
