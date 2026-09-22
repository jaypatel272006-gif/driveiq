import React from 'react';
import { CARS_DATA } from '../data/cars';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { VehicleCard } from '../components/ui/VehicleCard';
import { Bookmark, GitCompare, Calendar, Sliders, CheckCircle2, User, ArrowRight, Trash2 } from 'lucide-react';

export const GaragePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    shortlistIds,
    toggleShortlist,
    compareIds,
    toggleCompare,
    testDrives,
    purchaseStage,
    setPurchaseStage
  } = useApp();

  const shortlistedCars = CARS_DATA.filter(c => shortlistIds.includes(c.id));
  const comparedCars = CARS_DATA.filter(c => compareIds.includes(c.id));

  const journeyStages = [
    { id: 'RESEARCH', label: '1. Research' },
    { id: 'SHORTLIST', label: '2. Shortlist' },
    { id: 'COMPARE', label: '3. Compare' },
    { id: 'TEST_DRIVE', label: '4. Test Drive' },
    { id: 'FINANCE', label: '5. Finance' },
    { id: 'PURCHASE', label: '6. Purchase' }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-cyan-400 fill-cyan-400/20" />
            My Garage Command Center
          </h1>
          <p className="text-xs text-slate-400">Personalized dashboard tracking your vehicle shortlist, test drives, and buying journey.</p>
        </div>

        <Link
          to="/find-my-car"
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 w-fit"
        >
          <Sliders className="w-4 h-4" /> Re-Run AI Finder Wizard
        </Link>
      </div>

      {/* 6-STAGE PURCHASE JOURNEY TRACKER */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Interactive Purchase Journey Tracker
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {journeyStages.map((stg, idx) => {
            const isActive = purchaseStage === stg.id;

            return (
              <button
                key={stg.id}
                onClick={() => setPurchaseStage(stg.id)}
                className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {stg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE USER PROFILE SUMMARY CARD */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-500 block uppercase font-bold">BUDGET TARGET</span>
          <span className="text-base font-extrabold text-cyan-400">₹{userProfile.budgetLakhs} Lakhs</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-bold">POWERTRAIN & FUEL</span>
          <span className="text-base font-extrabold text-white">{userProfile.fuelPreference} / {userProfile.transmissionPreference}</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-bold">USAGE PATTERN</span>
          <span className="text-base font-extrabold text-emerald-400">{userProfile.monthlyKm} km/mo ({userProfile.cityPercentage}% City)</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-bold">FAMILY & BOOT</span>
          <span className="text-base font-extrabold text-amber-400">{userProfile.familySize} Members • {userProfile.bootRequirement} Boot</span>
        </div>
      </div>

      {/* SHORTLISTED CARS SECTION */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" /> Shortlisted Vehicles ({shortlistedCars.length})
        </h2>

        {shortlistedCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedCars.map(car => (
              <VehicleCard key={car.id} vehicle={car} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
            <p className="text-xs font-medium">Your shortlist is empty. Explore cars and click the bookmark button to save them here.</p>
          </div>
        )}
      </div>

      {/* BOOKED TEST DRIVES */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" /> Booked Test Drives ({testDrives.length})
        </h2>

        {testDrives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testDrives.map(td => (
              <div key={td.id} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{td.carName}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold">
                    {td.status}
                  </span>
                </div>
                <p className="text-slate-400">{td.variantName}</p>
                <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
                  <span>📅 {td.preferredDate} ({td.preferredTime})</span>
                  <span>📍 {td.city}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
            <p className="text-xs font-medium">No test drives requested yet. Request a test drive directly from any car page.</p>
          </div>
        )}
      </div>

    </div>
  );
};
