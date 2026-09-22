import React from 'react';
import { Link } from 'react-router-dom';
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
  Cpu,
  DollarSign,
  Compass,
  Radar
} from 'lucide-react';
import { VehicleImage } from '../components/ui/VehicleImage';
import { VehicleCard } from '../components/ui/VehicleCard';

export const HomePage: React.FC = () => {
  const { setIsAIAdvisorOpen, openTestDriveModal } = useApp();

  const heroCar = CARS_DATA[0]; // Creta
  const popularCars = CARS_DATA.slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Automotive Telemetry Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08)_0%,rgba(5,7,13,0)_70%)] pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Branding Lockup */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-tech-mono uppercase tracking-widest">
                <Radar className="w-3.5 h-3.5 animate-pulse" />
                AUTOMOTIVE INTELLIGENCE OS
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 font-mono mt-2">
                DRIVE<span className="text-cyan-400">IQ</span>
              </h2>
            </div>

            {/* Main Title & Subtitle */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Find the vehicle that <br />
              <span className="text-gradient-cyan">actually fits your life.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              DriveIQ goes beyond generic specification tables. Our multi-factor intelligence engine evaluates your budget, driving patterns, running costs, and family requirements to pinpoint your ideal vehicle.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/find-my-car"
                className="btn-driveiq btn-driveiq-primary px-8 py-4 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-cyan-500/25"
              >
                <Sliders className="w-4 h-4" /> FIND MY CAR <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/cars"
                className="btn-driveiq btn-driveiq-secondary px-7 py-4 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" /> EXPLORE VEHICLES
              </Link>
            </div>

            {/* Secondary Quick Action Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-tech-mono text-slate-400 border-t border-white/5">
              <Link to="/finance" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Calculate EMI
              </Link>
              <Link to="/ownership" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Total Ownership Cost
              </Link>
              <Link to="/safety" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Safety Ratings
              </Link>
              <Link to="/used" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <Car className="w-3.5 h-3.5 text-purple-400" /> Used vs New Valuation
              </Link>
            </div>

          </div>

          {/* Right Column: Interactive Hero Match Preview */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />
            
            <div className="card-level-3 p-6 space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    94% MATCH SCORED
                  </span>
                  <p className="text-[10px] text-slate-400 font-tech-mono mt-1">MATCHED TO USER LIFESTYLE</p>
                </div>
                <ScoreRing score={94} size={52} strokeWidth={5} color="#10b981" />
              </div>

              <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 shadow-xl bg-[#05070D]">
                <VehicleImage
                  src={heroCar.images.hero || heroCar.image}
                  alt={heroCar.name}
                  loading="eager"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">{heroCar.brand}</span>
                <h3 className="text-xl font-bold text-white">{heroCar.name}</h3>
                <p className="text-xs text-slate-400 font-tech-mono mt-0.5">
                  ₹{heroCar.startingPriceLakhs}L – ₹{heroCar.maxPriceLakhs}L • {heroCar.fuelTypes.join('/')} • {heroCar.ncapRating}-Star NCAP
                </p>
              </div>

              {/* Explainable Match Factors */}
              <div className="p-3.5 rounded-xl bg-[#05070D]/90 border border-white/10 text-xs text-slate-300 space-y-1.5 font-tech-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Fits target ₹15L budget & city traffic split</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Low maintenance (~₹12.5k/yr) & high resale</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>5-Star safety rating & 190mm ground clearance</span>
                </div>
              </div>

              <button
                onClick={() => openTestDriveModal(heroCar.id, heroCar.name)}
                className="btn-driveiq btn-driveiq-primary w-full py-3 text-xs"
              >
                Request Official Test Drive →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW DRIVEIQ WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-bold text-white">How DriveIQ Intelligence Works</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Traditional car sites show thousands of unranked listings. DriveIQ evaluates your actual lifestyle to pinpoint the exact vehicle for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Input Lifestyle',
              desc: 'Target budget, monthly kilometres, city/highway usage split, and family size.',
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
              desc: 'Multi-factor evaluation engine generates true 0-100% explainable match scores.',
              icon: Cpu
            },
            {
              step: '04',
              title: 'Financial Verdict',
              desc: 'Calculate 3/5/7-yr total cost of ownership, EMI breakdown, and exact variant fit.',
              icon: Calculator
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-level-2 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-tech-mono font-bold text-cyan-400">{item.step}</span>
                  <div className="p-2.5 rounded-xl bg-white/5 text-cyan-400">
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

      {/* 3. FIND MY CAR CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-level-3 p-8 sm:p-12 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-tech-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
              PRIMARY VEHICLE DISCOVERY
            </span>
            <h2 className="text-3xl font-bold text-white">Ready to find your match?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Launch our 7-Step AI Car Finder Wizard. Takes less than 2 minutes to generate your top personalized recommendations with explainable scores.
            </p>
          </div>
          <Link
            to="/find-my-car"
            className="btn-driveiq btn-driveiq-primary px-8 py-4 rounded-xl text-sm font-bold shrink-0 flex items-center gap-2"
          >
            FIND MY CAR <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. POPULAR CARS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Vehicles in Database</h2>
            <p className="text-xs text-slate-400">Explore top Indian market SUVs, Sedans, EVs, and Hybrids</p>
          </div>
          <Link to="/cars" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 font-tech-mono">
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
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Full Intelligence Operating Suite</h2>
          <p className="text-sm text-slate-400">Calculators and decision engines for every stage of your buying journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/ownership" className="card-level-2 p-6 space-y-4 hover:border-emerald-500/40 group">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Ownership Cost Calculator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate total 3, 5, and 7-year cost of ownership including fuel, maintenance, insurance, and depreciated resale.
            </p>
          </Link>

          <Link to="/finance" className="card-level-2 p-6 space-y-4 hover:border-amber-500/40 group">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Finance Studio & EMI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Model monthly loan EMIs, down payments, total interest breakdown, and affordability index based on monthly income.
            </p>
          </Link>

          <Link to="/safety" className="card-level-2 p-6 space-y-4 hover:border-blue-500/40 group">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
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
        <div className="card-level-3 p-8 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40 shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Have a specific car question?</h3>
              <p className="text-xs text-slate-400">Ask our AI Advisor: "Creta vs Seltos?", "Is EV worth it?", "Best SUV under ₹15L?"</p>
            </div>
          </div>

          <button
            onClick={() => setIsAIAdvisorOpen(true)}
            className="btn-driveiq btn-driveiq-secondary px-6 py-3 text-xs shrink-0"
          >
            Launch AI Chat Assistant →
          </button>
        </div>
      </section>

    </div>
  );
};
