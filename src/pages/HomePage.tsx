import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CARS_DATA } from '../data/cars';
import { ScoreRing } from '../components/ui/ScoreRing';
import {
  Sliders,
  Sparkles,
  GitCompare,
  Calculator,
  ShieldCheck,
  Zap,
  ArrowRight,
  Car,
  Bot,
  CheckCircle,
  TrendingUp,
  Cpu,
  DollarSign
} from 'lucide-react';
import { VehicleImage } from '../components/ui/VehicleImage';
import { VehicleCard } from '../components/ui/VehicleCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAIAdvisorOpen, openTestDriveModal } = useApp();

  const heroCar = CARS_DATA[0]; // Creta
  const popularCars = CARS_DATA.slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              Automotive Intelligence OS
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Find the car that <br />
              <span className="gradient-text-cyan">fits your life.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              AI-powered car recommendations based on your budget, lifestyle, driving habits and priorities. Don't just compare cars. Find your car.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/find-my-car"
                className="px-8 py-4 rounded-2xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:brightness-110 transition-all shadow-xl shadow-cyan-500/25 flex items-center gap-2"
              >
                Find My Perfect Car <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/compare"
                className="px-6 py-4 rounded-2xl text-sm font-bold text-white bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4 text-cyan-400" /> Compare Cars
              </Link>
            </div>

            {/* Secondary Quick Action Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-mono text-slate-400 border-t border-slate-900">
              <Link to="/finance" className="hover:text-cyan-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Calculate EMI
              </Link>
              <Link to="/ownership" className="hover:text-cyan-400 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Ownership Cost
              </Link>
              <Link to="/safety" className="hover:text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Check Safety
              </Link>
              <Link to="/used" className="hover:text-cyan-400 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-purple-400" /> Used vs New
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-3xl blur-2xl opacity-20 animate-pulse-subtle" />
            
            <div className="relative glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/90 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  94% Match Verified
                </span>
                <ScoreRing score={94} size={54} strokeWidth={5} color="#10b981" />
              </div>

              <div className="w-full h-52 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                <VehicleImage
                  src={heroCar.images.hero || heroCar.image}
                  alt={heroCar.name}
                  loading="eager"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{heroCar.brand}</span>
                <h3 className="text-xl font-black text-white">{heroCar.name}</h3>
                <p className="text-xs text-slate-400">
                  ₹{heroCar.startingPriceLakhs}L – ₹{heroCar.maxPriceLakhs}L • {heroCar.fuelTypes.join('/')} • {heroCar.ncapRating}-Star Safety
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Matches your ₹15L budget & city traffic split</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Low maintenance (~₹12.5k/yr) & high resale</span>
                </div>
              </div>

              <button
                onClick={() => openTestDriveModal(heroCar.id, heroCar.name)}
                className="w-full py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
              >
                Request Test Drive →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW DRIVEIQ WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-white">How DriveIQ Intelligence Works</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Traditional car sites show thousands of listings. DriveIQ evaluates your actual lifestyle to pinpoint the exact vehicle for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Input Lifestyle',
              desc: 'Budget, monthly kilometres, city/highway usage split, and family size.',
              icon: Sliders
            },
            {
              step: '02',
              title: 'Rank Priorities',
              desc: 'Weight Safety, Running Costs, Comfort, Performance, and Resale value.',
              icon: Sparkles
            },
            {
              step: '03',
              title: 'Algorithmic Scoring',
              desc: 'Multi-factor evaluation engine generates true 0-100% match scores.',
              icon: Cpu
            },
            {
              step: '04',
              title: 'Financial Verdict',
              desc: 'Calculate 3/5/7-yr total cost of ownership, EMI, and exact variant.',
              icon: Calculator
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-cyan-400">{item.step}</span>
                  <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. AI CAR FINDER TEASER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
              Core Product
            </span>
            <h2 className="text-3xl font-black text-white">Ready to find your match?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Launch our 7-Step AI Car Finder Wizard. Takes less than 2 minutes to generate your top 5 recommendations.
            </p>
          </div>
          <Link
            to="/find-my-car"
            className="px-8 py-4 rounded-2xl text-sm font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-xl shadow-cyan-500/25 shrink-0 flex items-center gap-2"
          >
            Launch AI Finder Wizard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. POPULAR CARS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Popular Vehicles in Database</h2>
            <p className="text-xs text-slate-400">Explore top Indian market SUVs, Sedans, EVs, and Hybrids</p>
          </div>
          <Link to="/cars" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
            View All Vehicles ({CARS_DATA.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCars.map(car => (
            <VehicleCard key={car.id} vehicle={car} />
          ))}
        </div>
      </section>

      {/* 5. TOOLS & CALCULATORS SUITE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white">Full Intelligence Operating Suite</h2>
          <p className="text-sm text-slate-400">Calculators and decision engines for every stage of your buying journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/ownership" className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 group">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Ownership Cost Calculator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate total 3, 5, and 7-year cost of ownership including fuel, maintenance, insurance, and depreciated resale.
            </p>
          </Link>

          <Link to="/finance" className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 group">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Finance Studio & EMI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Model monthly loan EMIs, down payments, total interest breakdown, and affordability index based on monthly income.
            </p>
          </Link>

          <Link to="/safety" className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-blue-500/40 group">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Safety Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crash test ratings, adult vs child protection breakdown, Level-2 ADAS features, and passive safety dictionary.
            </p>
          </Link>
        </div>
      </section>

      {/* 6. AI ADVISOR BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40 shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Have a specific car question?</h3>
              <p className="text-xs text-slate-400">Ask our AI Advisor: "Creta vs Seltos?", "Is EV worth it?", "Best SUV under ₹15L?"</p>
            </div>
          </div>

          <button
            onClick={() => setIsAIAdvisorOpen(true)}
            className="px-6 py-3 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 transition-all shrink-0"
          >
            Launch AI Chat Assistant →
          </button>
        </div>
      </section>

    </div>
  );
};
