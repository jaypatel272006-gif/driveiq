import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 space-y-6">
      <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
        <Compass className="w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white">404 — Route Not Found</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          The automotive intelligence page you requested does not exist or has been relocated.
        </p>
      </div>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
};
