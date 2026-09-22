import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types/car';
import { useApp } from '../../context/AppContext';
import { VehicleImage } from './VehicleImage';
import { ScoreRing } from './ScoreRing';
import { Shield, Fuel, Gauge, GitCompare, Bookmark, ArrowRight, Check } from 'lucide-react';

import { getVehicleCanonicalRoute } from '../../utils/slugify';

interface VehicleCardProps {
  vehicle: Vehicle;
  matchPercentage?: number;
  showMatchScore?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  matchPercentage,
  showMatchScore = false
}) => {
  const { toggleShortlist, isShortlisted, toggleCompare, isInCompare } = useApp();

  const isSaved = isShortlisted(vehicle.id);
  const isCompared = isInCompare(vehicle.id);

  // Canonical route calculation
  const targetRoute = vehicle.canonicalRoute || getVehicleCanonicalRoute(vehicle.brand, vehicle.name, vehicle.slug, vehicle.brandSlug);

  return (
    <div className="glass-card rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-cyan-500/10">
      
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
        <VehicleImage
          src={vehicle.images.hero || vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-950/80 border border-slate-800 text-cyan-400 backdrop-blur-md">
              {vehicle.bodyType}
            </span>
            {vehicle.dataStatus && (
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold backdrop-blur-md uppercase tracking-wider ${
                vehicle.dataStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {vehicle.dataStatus}
              </span>
            )}
          </div>

          <div className="flex gap-1.5 pointer-events-auto">
            <button
              onClick={() => toggleShortlist(vehicle.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-all border ${
                isSaved
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isSaved ? 'Remove from Garage' : 'Save to Garage'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={() => toggleCompare(vehicle.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-all border ${
                isCompared
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isCompared ? 'In Compare List' : 'Add to Compare'}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optional Match Percentage Overlay Badge */}
        {showMatchScore && matchPercentage !== undefined && (
          <div className="absolute bottom-3 right-3 backdrop-blur-md bg-slate-950/90 border border-cyan-500/40 rounded-2xl px-3 py-1.5 flex items-center gap-2">
            <ScoreRing score={matchPercentage} size={28} strokeWidth={3} />
            <div className="text-left font-mono">
              <span className="text-[9px] text-slate-400 block uppercase">MATCH SCORE</span>
              <span className="text-xs font-black text-cyan-400">{matchPercentage}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              {vehicle.brand}
            </span>
            <span className="text-[10px] text-amber-400 font-bold font-mono flex items-center gap-1">
              <Shield className="w-3 h-3" /> {vehicle.ncapRating}-Star Safety
            </span>
          </div>

          <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors mt-0.5">
            {vehicle.name}
          </h3>

          <p className="text-sm font-black text-emerald-400 font-mono mt-1">
            ₹{vehicle.startingPriceLakhs}L – ₹{vehicle.maxPriceLakhs}L
            <span className="text-[10px] font-normal text-slate-400 block font-sans">Ex-Showroom Range</span>
          </p>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Fuel className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate">{vehicle.fuelTypes.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">{vehicle.transmissions.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <Link
            to={targetRoute}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
