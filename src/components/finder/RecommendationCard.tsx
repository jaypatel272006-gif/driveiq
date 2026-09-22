import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecommendationResult } from '../../types/car';
import { useApp } from '../../context/AppContext';
import { ScoreRing } from '../ui/ScoreRing';
import { VehicleImage } from '../ui/VehicleImage';
import { Check, X, Shield, Fuel, Gauge, Sliders, ArrowRight, Bookmark, GitCompare } from 'lucide-react';

interface RecommendationCardProps {
  result: RecommendationResult;
  rank: number;
  onWhyThisCarClick: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  result,
  rank,
  onWhyThisCarClick
}) => {
  const navigate = useNavigate();
  const { toggleShortlist, isShortlisted, toggleCompare, isInCompare } = useApp();
  const { vehicle, matchPercentage, matchRingColor, whyRecommend, thingsToConsider } = result;

  const isSaved = isShortlisted(vehicle.id);
  const isCompared = isInCompare(vehicle.id);

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 p-6 flex flex-col lg:flex-row gap-6 relative group">
      
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
          rank === 1
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/30'
            : rank === 2
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950'
            : 'bg-slate-800 text-slate-300 border border-slate-700'
        }`}>
          {rank === 1 ? '🏆 Best Match' : `#${rank} Recommendation`}
        </span>
      </div>

      {/* Image & Match Gauge */}
      <div className="lg:w-72 shrink-0 flex flex-col items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 relative">
        <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300">
          <VehicleImage
            src={vehicle.images.hero || vehicle.image}
            alt={vehicle.name}
          />
        </div>
        <div className="flex items-center justify-between w-full px-2 pt-2 border-t border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Match Score</span>
            <span className="text-xl font-black text-white font-mono">{matchPercentage}%</span>
          </div>
          <ScoreRing score={matchPercentage} size={58} strokeWidth={6} color={matchRingColor} />
        </div>
      </div>

      {/* Main Details & Recommendations */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        
        {/* Title & Key Metrics */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{vehicle.brand}</span>
              <h3 className="text-2xl font-black text-white">{vehicle.name}</h3>
              <p className="text-xs text-slate-400">
                ₹{vehicle.startingPriceLakhs} Lakh – ₹{vehicle.maxPriceLakhs} Lakh ex-showroom
              </p>
            </div>
            
            {/* Quick Action Badges */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleShortlist(vehicle.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isSaved
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isSaved ? 'Remove from shortlist' : 'Save to Garage'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => toggleCompare(vehicle.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isCompared
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isCompared ? 'In Compare' : 'Add to Compare'}
              >
                <GitCompare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Specs Pill Ticker */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-cyan-400" />
              {vehicle.fuelTypes.join(' / ')}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              {vehicle.transmissions.join(', ')}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              {vehicle.ncapRating}-Star Safety
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300">
              {vehicle.bootSpaceLiters}L Boot
            </span>
          </div>
        </div>

        {/* Why We Recommend & Considerations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div>
            <h5 className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Why We Recommend It:
            </h5>
            <ul className="space-y-1 text-slate-300">
              {whyRecommend.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-amber-400 mb-1.5 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Things to Consider:
            </h5>
            <ul className="space-y-1 text-slate-400">
              {thingsToConsider.map((con, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={onWhyThisCarClick}
            className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all"
          >
            Why This Car?
          </button>

          <button
            onClick={() => navigate(`/cars/${vehicle.id}`)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate(`/variants?carId=${vehicle.id}`)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" /> Find Variant
          </button>
        </div>

      </div>
    </div>
  );
};
