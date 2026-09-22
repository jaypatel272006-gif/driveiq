import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { searchVehicles } from '../../services/searchService';
import { Search, X, Car, Sliders, Calculator, ShieldCheck, Zap, DollarSign, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandMenu: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const quickTools = [
    { label: 'AI Car Finder Wizard', path: '/find-my-car', icon: Sliders, category: 'Tool' },
    { label: '3-Car Head-to-Head Compare', path: '/compare', icon: ArrowRight, category: 'Tool' },
    { label: 'Ownership Cost Calculator (3/5/7 Yrs)', path: '/ownership', icon: Calculator, category: 'Tool' },
    { label: 'Finance Studio & EMI Calculator', path: '/finance', icon: DollarSign, category: 'Tool' },
    { label: 'EV Range & Savings Hub', path: '/ev', icon: Zap, category: 'Tool' },
    { label: 'Safety Ratings Dashboard', path: '/safety', icon: ShieldCheck, category: 'Tool' }
  ];

  const matchingCars = searchVehicles(query);

  const matchingTools = quickTools.filter(
    t => t.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type to search cars (e.g. Creta, Nexon EV), tools, or calculators..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-4">
            
            {/* Matching Vehicles */}
            {matchingCars.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-cyan-400" />
                  Vehicles ({matchingCars.length})
                </h4>
                <div className="space-y-1">
                  {matchingCars.map(car => (
                    <button
                      key={car.id}
                      onClick={() => handleSelect(`/cars/${car.id}`)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={car.image} alt={car.name} className="w-10 h-7 rounded object-cover" />
                        <div>
                          <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                            {car.name}
                          </span>
                          <span className="text-xs text-slate-400 ml-2">
                            ₹{car.startingPriceLakhs}L – ₹{car.maxPriceLakhs}L
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {car.bodyType}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tools */}
            {matchingTools.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Tools & Intelligence
                </h4>
                <div className="space-y-1">
                  {matchingTools.map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(tool.path)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                            {tool.label}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {matchingCars.length === 0 && matchingTools.length === 0 && (
              <div className="py-8 text-center text-slate-500">
                <p className="text-sm font-medium">No results found for "{query}"</p>
                <p className="text-xs mt-1">Try searching for "Creta", "Nexon EV", "EMI", or "EV Hub"</p>
              </div>
            )}

          </div>

          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Press <kbd className="px-1 bg-slate-800 rounded">ESC</kbd> to close</span>
            <span>DriveIQ Command Search</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
