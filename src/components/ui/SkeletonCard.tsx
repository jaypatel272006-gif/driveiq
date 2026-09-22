import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card-level-2 rounded-2xl overflow-hidden p-5 space-y-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-slate-900/80 rounded-xl" />

      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="w-16 h-3 bg-slate-900/80 rounded" />
          <div className="w-20 h-3 bg-slate-900/80 rounded" />
        </div>
        <div className="w-3/4 h-5 bg-slate-900/80 rounded" />
        <div className="w-1/2 h-4 bg-slate-900/80 rounded" />
      </div>

      {/* Specs Skeleton */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
        <div className="h-4 bg-slate-900/80 rounded" />
        <div className="h-4 bg-slate-900/80 rounded" />
      </div>

      {/* Button Skeleton */}
      <div className="w-full h-10 bg-slate-900/90 rounded-xl mt-2" />
    </div>
  );
};
