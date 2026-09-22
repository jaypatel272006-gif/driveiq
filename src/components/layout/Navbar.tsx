import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Search,
  Bot,
  Sun,
  Moon,
  Bookmark,
  GitCompare,
  ShieldCheck,
  Zap,
  Calculator,
  Car,
  User,
  Sliders,
  DollarSign
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    shortlistIds,
    compareIds,
    setIsSearchOpen,
    setIsAIAdvisorOpen
  } = useApp();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/find-my-car', label: 'Find My Car', icon: Sliders, highlight: true },
    { path: '/cars', label: 'Cars', icon: Car },
    { path: '/compare', label: 'Compare', icon: GitCompare, badge: compareIds.length },
    { path: '/variants', label: 'Variants', icon: Sliders },
    { path: '/ev', label: 'EV Hub', icon: Zap },
    { path: '/used', label: 'Used Cars', icon: Car },
    { path: '/finance', label: 'Finance', icon: DollarSign },
    { path: '/ownership', label: 'Ownership', icon: Calculator },
    { path: '/safety', label: 'Safety', icon: ShieldCheck },
    { path: '/resale', label: 'Resale', icon: DollarSign },
    { path: '/garage', label: 'My Garage', icon: Bookmark, badge: shortlistIds.length }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#05070D]/85 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#05070D] rounded-[11px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white font-mono">
              DRIVE<span className="text-cyan-400">IQ</span>
            </span>
            <span className="hidden sm:block text-[8px] font-semibold text-slate-400 tracking-widest uppercase">
              Automotive Intelligence OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : link.highlight
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold font-tech-mono bg-cyan-500 text-slate-950">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-[#080C14] border border-white/10 hover:border-white/20 hover:text-slate-200 transition-all"
            title="Global Search (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Search cars, tools...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-tech-mono bg-slate-900 text-slate-400 rounded border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* AI Advisor Trigger */}
          <button
            onClick={() => setIsAIAdvisorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/50 shadow-md shadow-cyan-950/40 transition-all"
          >
            <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden md:inline">AI Advisor</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-[#080C14] border border-white/10 hover:border-white/20 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* User / Garage Link */}
          <Link
            to="/garage"
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-[#080C14] border border-white/10 hover:border-white/20 transition-all"
            title="My Garage Dashboard"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
};
