import React, { useState } from 'react';
import { VehicleImageSet } from '../../types/car';
import { VehicleImage } from './VehicleImage';

interface VehicleGalleryProps {
  images: VehicleImageSet;
  vehicleName: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images, vehicleName }) => {
  const angles: { key: keyof VehicleImageSet; label: string }[] = [
    { key: 'hero', label: 'Hero View' },
    { key: 'front', label: 'Front Exterior' },
    { key: 'side', label: 'Side Profile' },
    { key: 'rear', label: 'Rear Styling' },
    { key: 'interior', label: 'Interior Lounge' },
    { key: 'dashboard', label: 'Cockpit Dashboard' }
  ];

  // Filter only images that are defined
  const availableImages = angles.filter(a => !!images[a.key]);

  const [activeKey, setActiveKey] = useState<keyof VehicleImageSet>('hero');

  const activeSrc = images[activeKey] || images.hero;

  return (
    <div className="space-y-4">
      {/* Active Preview */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <VehicleImage
          src={activeSrc}
          alt={`${vehicleName} ${activeKey}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 text-xs font-mono font-bold text-cyan-400">
          {angles.find(a => a.key === activeKey)?.label || 'Hero View'}
        </div>
      </div>

      {/* Thumbnails Bar (Only shown if more than 1 image exists) */}
      {availableImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {availableImages.map(img => (
            <button
              key={img.key}
              onClick={() => setActiveKey(img.key)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeKey === img.key
                  ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <VehicleImage
                src={images[img.key]!}
                alt={`${vehicleName} thumbnail`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
