import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Cpu, Sliders, DollarSign, Calculator } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mb-16 xl:mb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-lg font-black tracking-wider text-white font-mono">
              DRIVE<span className="text-cyan-400">IQ</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automotive Intelligence OS — Don't just compare cars. Find your car using multi-factor lifestyle algorithms.
          </p>
          <div className="flex items-center gap-2 text-xs text-cyan-400/80 font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>DriveIQ Engine v4.2.0 • Indian Market Edition</span>
          </div>
        </div>

        {/* Intelligence Tools */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Intelligence Tools</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/find-my-car" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Sliders className="w-3 h-3 text-cyan-400"/> AI Car Finder Wizard</Link></li>
            <li><Link to="/compare" className="hover:text-cyan-400 transition-colors">3-Car Head-to-Head Comparison</Link></li>
            <li><Link to="/variants" className="hover:text-cyan-400 transition-colors">Exact Variant Matcher</Link></li>
            <li><Link to="/ev" className="hover:text-cyan-400 transition-colors">EV Range & Savings Hub</Link></li>
            <li><Link to="/used" className="hover:text-cyan-400 transition-colors">New vs Used Financial Verdict</Link></li>
          </ul>
        </div>

        {/* Financial Calculators */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Calculators & Analytics</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/ownership" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Calculator className="w-3 h-3 text-emerald-400"/> Total Cost of Ownership (3/5/7 Yrs)</Link></li>
            <li><Link to="/finance" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-amber-400"/> Finance & EMI Studio</Link></li>
            <li><Link to="/safety" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-blue-400"/> Safety Intelligence Ratings</Link></li>
            <li><Link to="/resale" className="hover:text-cyan-400 transition-colors">7-Year Resale Depreciation Curve</Link></li>
            <li><Link to="/garage" className="hover:text-cyan-400 transition-colors">My Garage Purchase Journey</Link></li>
          </ul>
        </div>

        {/* Legal Disclaimer & Admin */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform Information</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            All prices, specifications, and safety ratings are based on official manufacturer specs and Indian automotive datasets. Estimates are provided for intelligence and decision support.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/admin" className="text-xs font-mono text-slate-500 hover:text-slate-300 underline">
              Admin Portal
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/admin/vehicle-images" className="text-xs font-mono text-cyan-500/80 hover:text-cyan-400 underline">
              Vehicle Images Studio
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/admin/database-health" className="text-xs font-mono text-emerald-500/80 hover:text-emerald-400 underline">
              Database Health Dashboard
            </Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} DriveIQ Operating System. All rights reserved.</span>
        <span>Built with Precision for Indian Car Buyers 🇮🇳</span>
      </div>
    </footer>
  );
};
