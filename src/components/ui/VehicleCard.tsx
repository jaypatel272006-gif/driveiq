import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types/car';
import { useApp } from '../../context/AppContext';
import { VehicleImage } from './VehicleImage';
import { ScoreRing } from './ScoreRing';
import { Shield, Fuel, Gauge, GitCompare, Bookmark, ArrowRight } from 'lucide-react';

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
    <div className="card-level-2 rounded-2xl overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#05070D]">
        <VehicleImage
          src={vehicle.images.hero || vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#05070D]/80 border border-white/10 text-cyan-400 backdrop-blur-md">
              {vehicle.bodyType}
            </span>
            {vehicle.dataStatus && (
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold backdrop-blur-md uppercase tracking-wider ${
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
                  : 'bg-[#05070D]/80 border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40'
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
                  : 'bg-[#05070D]/80 border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40'
              }`}
              title={isCompared ? 'In Compare List' : 'Add to Compare'}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optional Match Percentage Overlay Badge */}
        {showMatchScore && matchPercentage !== undefined && (
          <div className="absolute bottom-3 right-3 backdrop-blur-md bg-[#05070D]/90 border border-cyan-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <ScoreRing score={matchPercentage} size={28} strokeWidth={3} />
            <div className="text-left font-tech-mono">
              <span className="text-[9px] text-slate-400 block uppercase">MATCH SCORE</span>
              <span className="text-xs font-bold text-cyan-400">{matchPercentage}%</span>
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
            <span className="text-[10px] text-amber-400 font-bold font-tech-mono flex items-center gap-1">
              <Shield className="w-3 h-3" /> {vehicle.ncapRating}-Star Safety
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mt-0.5">
            {vehicle.name}
          </h3>

          <p className="text-sm font-bold text-emerald-400 font-tech-mono mt-1">
            ₹{vehicle.startingPriceLakhs}L – ₹{vehicle.maxPriceLakhs}L
            <span className="text-[10px] font-normal text-slate-400 block font-sans">Ex-Showroom Range</span>
          </p>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-white/5">
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
            className="btn-driveiq btn-driveiq-primary w-full flex items-center justify-center gap-1.5"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
