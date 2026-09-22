import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Compass, Sliders, Car, GitCompare, Bookmark } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { shortlistIds, compareIds } = useApp();

  const mobileItems = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/find-my-car', label: 'Finder', icon: Sliders, highlight: true },
    { path: '/cars', label: 'Cars', icon: Car },
    { path: '/compare', label: 'Compare', icon: GitCompare, badge: compareIds.length },
    { path: '/garage', label: 'Garage', icon: Bookmark, badge: shortlistIds.length }
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around">
      {mobileItems.map(item => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isActive
                ? 'text-cyan-400 font-bold'
                : item.highlight
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-extrabold bg-cyan-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
