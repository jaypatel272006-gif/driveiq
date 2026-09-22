import React, { useState } from 'react';
import { Car, ImageOff } from 'lucide-react';

interface VehicleImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  loading?: 'lazy' | 'eager';
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  fallbackTitle = 'Vehicle Image',
  fallbackSubtitle = 'DriveIQ Automotive Intelligence'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.warn(`[DriveIQ Image System] Vehicle image failed to load or returned 404 error: "${src}"`);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError || !src) {
    return (
      <div className={`w-full h-full min-h-[160px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3 relative overflow-hidden select-none`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 shadow-inner">
          <Car className="w-8 h-8" />
        </div>
        <div className="space-y-1 z-10">
          <span className="text-xs font-bold text-white block uppercase tracking-wider font-mono">{alt || fallbackTitle}</span>
          <span className="text-[10px] text-slate-400 block font-mono flex items-center justify-center gap-1">
            <ImageOff className="w-3 h-3 text-amber-400" />
            Image Source Unavailable
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400">
          {fallbackSubtitle}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center z-10">
          <Car className="w-6 h-6 text-slate-700 animate-bounce" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
