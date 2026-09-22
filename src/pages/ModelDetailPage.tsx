import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehicleDb } from '../data/db/vehicleDatabase';
import { useApp } from '../context/AppContext';
import { ScoreRing } from '../components/ui/ScoreRing';
import {
  ChevronRight,
  Shield,
  Fuel,
  Gauge,
  Sliders,
  Calculator,
  GitCompare,
  Bookmark,
  CheckCircle,
  XCircle,
  Zap,
  Info,
  DollarSign,
  BatteryCharging,
  Cpu
} from 'lucide-react';

import { VehicleGallery } from '../components/ui/VehicleGallery';

export const ModelDetailPage: React.FC = () => {
  const { brandSlug, modelSlug } = useParams<{ brandSlug: string; modelSlug: string }>();
  const navigate = useNavigate();
  const { toggleShortlist, isShortlisted, toggleCompare, isInCompare, openTestDriveModal } = useApp();

  const modelData = vehicleDb.getModelBySlug(brandSlug || '', modelSlug || '');
  
  if (!modelData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">Vehicle Model Not Found</h2>
        <p className="text-xs text-slate-400">No model matching "{brandSlug}/{modelSlug}" was found in database.</p>
        <Link to="/cars" className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400">
          Back to Cars Catalogue
        </Link>
      </div>
    );
  }

  const complete = vehicleDb.getCompleteVehicleDataByModelId(modelData.id)!;
  const { brand, model, variants, safety, scores, ownership, resale } = complete;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || '');
  const activeVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

  const isSaved = isShortlisted(model.id);
  const isCompared = isInCompare(model.id);

  const isEV = model.availableFuelTypes.includes('Electric');

  // Convert gallery strings into VehicleImageSet
  const galleryImageSet = {
    hero: model.heroImage,
    front: model.gallery[0] || model.heroImage,
    side: model.gallery[1] || model.heroImage,
    interior: model.gallery[2] || model.heroImage
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/cars" className="hover:text-cyan-400">Cars</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-300 font-bold uppercase">{brand.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-cyan-400 font-bold">{model.name}</span>
      </div>

      {/* Hero Model Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-7">
          <VehicleGallery images={galleryImageSet} vehicleName={model.name} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">{brand.name}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{brand.name} {model.name}</h1>
            <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
              ₹{model.startingPriceLakhs} Lakh – ₹{model.endingPriceLakhs} Lakh
              <span className="text-[11px] font-normal text-slate-400 block font-sans">Ex-Showroom Base to Top Trim Range</span>
            </p>
          </div>

          {/* DriveIQ Calculated Scores Overview */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">SAFETY SCORE</span>
              <span className="text-lg font-black text-blue-400">{scores.safetyScore}/100</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">COMFORT</span>
              <span className="text-lg font-black text-cyan-400">{scores.comfortScore}/100</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">5-YR RESALE</span>
              <span className="text-lg font-black text-emerald-400">{resale.resaleAfter5YearsPercent}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{model.description}</p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => openTestDriveModal(model.id, `${brand.name} ${model.name}`, activeVariant?.name)}
              className="py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
            >
              Request Test Drive →
            </button>
            <button
              onClick={() => toggleShortlist(model.id)}
              className={`py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                isSaved ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              {isSaved ? 'Saved in Garage' : 'Save to Garage'}
            </button>
          </div>

        </div>

      </div>

      {/* VARIANT TRIM SELECTOR & DETAILED POWERTRAIN SPECS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Model Trims & Variants ({variants.length})</h2>
            <p className="text-xs text-slate-400">Select a specific trim variant to inspect exact engine/battery specs and pricing.</p>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedVariantId === v.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {v.name} (₹{v.price.exShowroomPriceLakhs}L)
              </button>
            ))}
          </div>
        </div>

        {/* Selected Variant Spec Sheet */}
        {activeVariant && (
          <div className="space-y-6">
            
            {/* Price Structure Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">EX-SHOWROOM PRICE:</span>
                <span className="text-sm font-bold text-emerald-400">₹{activeVariant.price.exShowroomPriceLakhs} Lakhs</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ESTIMATED ON-ROAD:</span>
                <span className="text-sm font-bold text-white">₹{activeVariant.price.estimatedOnRoadPriceLakhs} Lakhs</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ESTIMATED INSURANCE:</span>
                <span className="text-sm font-bold text-amber-400">~₹{activeVariant.price.insuranceEstRs.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">RTO / REGISTRATION:</span>
                <span className="text-sm font-bold text-cyan-400">~₹{activeVariant.price.registrationEstRs.toLocaleString()}</span>
              </div>
            </div>

            {/* Powertrain Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Powertrain & Performance
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Fuel Type:</span>
                    <span className="text-white font-bold">{activeVariant.fuelType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Transmission:</span>
                    <span className="text-indigo-400 font-bold">{activeVariant.transmission}</span>
                  </div>

                  {!isEV ? (
                    <>
                      <div className="flex justify-between py-2 border-b border-slate-800/60">
                        <span className="text-slate-400">Engine Displacement:</span>
                        <span className="text-white">{activeVariant.specifications.engineDisplacementCc} cc ({activeVariant.specifications.cylinderCount} Cylinders)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800/60">
                        <span className="text-slate-400">Max Power / Torque:</span>
                        <span className="text-white">{activeVariant.specifications.powerBhp} PS / {activeVariant.specifications.torqueNm} Nm</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800/60">
                        <span className="text-slate-400">Claimed Mileage:</span>
                        <span className="text-cyan-400 font-bold">{activeVariant.specifications.claimedMileageKmpl} km/l</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between py-2 border-b border-slate-800/60">
                        <span className="text-slate-400">Battery Pack Capacity:</span>
                        <span className="text-cyan-400 font-bold">{activeVariant.specifications.batteryCapacityKwh} kWh</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800/60">
                        <span className="text-slate-400">Claimed / Real-World Range:</span>
                        <span className="text-emerald-400 font-bold">{activeVariant.specifications.claimedRangeKm} km / {activeVariant.specifications.realWorldRangeKm} km</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800/60">
                        <span className="text-slate-400">Home Charging Time:</span>
                        <span className="text-white">{activeVariant.specifications.chargingTimeHours} Hours</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dimensions & Practicality */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Dimensions & Practicality
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Dimensions (L x W x H):</span>
                    <span className="text-white">{activeVariant.specifications.lengthMm} x {activeVariant.specifications.widthMm} x {activeVariant.specifications.heightMm} mm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Ground Clearance:</span>
                    <span className="text-white">{activeVariant.specifications.groundClearanceMm} mm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Boot Capacity:</span>
                    <span className="text-cyan-400 font-bold">{activeVariant.specifications.bootSpaceLiters} Liters</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Seating Capacity:</span>
                    <span className="text-white">{model.seatingCapacity} Passengers</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Factory Warranty:</span>
                    <span className="text-emerald-400 font-bold">{ownership.warrantyYears} Years / {ownership.warrantyKm.toLocaleString()} km</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Variant Link Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Link
                to={`/cars/${brand.slug}/${model.slug}/${activeVariant.slug}`}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                Inspect Specific Variant Page ({activeVariant.name}) →
              </Link>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
