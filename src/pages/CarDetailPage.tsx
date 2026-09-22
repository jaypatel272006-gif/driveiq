import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CARS_DATA } from '../data/cars';
import { vehicleDb } from '../data/db/vehicleDatabase';
import { convertModelToUIVehicle } from '../services/dataAdapter';
import { useApp } from '../context/AppContext';
import { ScoreRing } from '../components/ui/ScoreRing';
import {
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
  ArrowRight,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';

import { VehicleGallery } from '../components/ui/VehicleGallery';
import { VehicleCard } from '../components/ui/VehicleCard';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleShortlist, isShortlisted, toggleCompare, isInCompare, openTestDriveModal } = useApp();

  // Flexible lookup by ID or slug
  const foundModel = vehicleDb.getModelById(id || '') || vehicleDb.getModelBySlug('', id || '');
  const car = (foundModel ? convertModelToUIVehicle(foundModel.id) : null) || CARS_DATA.find(c => c.id === id) || CARS_DATA[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(car.variants[0]?.id || '');
  const activeVariant = car.variants.find(v => v.id === selectedVariantId) || car.variants[0];

  const isSaved = isShortlisted(car.id);
  const isCompared = isInCompare(car.id);

  const similarCars = CARS_DATA.filter(c => c.id !== car.id && (c.bodyType === car.bodyType || c.brand === car.brand)).slice(0, 3);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/cars" className="hover:text-cyan-400">Cars</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold">{car.name}</span>
      </div>

      {/* Hero Vehicle Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Gallery Image */}
        <div className="lg:col-span-7">
          <VehicleGallery images={car.images} vehicleName={car.name} />
        </div>

        {/* Overview & Quick CTAs */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">{car.brand}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{car.name}</h1>
            <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
              ₹{car.startingPriceLakhs} Lakh – ₹{car.maxPriceLakhs} Lakh
              <span className="text-xs font-normal text-slate-400 block font-sans">Estimated Ex-Showroom</span>
            </p>
          </div>

          {/* Quick Score Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">SAFETY</span>
              <span className="text-lg font-black text-amber-400">{car.safetyScore}/100</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">COMFORT</span>
              <span className="text-lg font-black text-cyan-400">{car.comfortScore}/100</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">RESALE</span>
              <span className="text-lg font-black text-emerald-400">{car.resaleValue5YrPercent}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {car.overview}
          </p>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => openTestDriveModal(car.id, car.name, activeVariant?.name)}
              className="py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
            >
              Request Test Drive →
            </button>
            <button
              onClick={() => toggleShortlist(car.id)}
              className={`py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                isSaved ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              {isSaved ? 'Saved in Garage' : 'Save to Garage'}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <button
              onClick={() => toggleCompare(car.id)}
              className={`text-xs font-semibold flex items-center gap-1 ${
                isCompared ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitCompare className="w-4 h-4" /> {isCompared ? 'In Comparison Matrix' : 'Add to Compare'}
            </button>
            <Link to={`/variants?carId=${car.id}`} className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
              <Sliders className="w-4 h-4" /> Find Exact Variant
            </Link>
          </div>

        </div>

      </div>

      {/* VARIANT SELECTOR & SPECIFICATIONS MATRIX */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Variants & Detailed Specs</h2>
            <p className="text-xs text-slate-400">Select a specific variant trim to view exact powertrain & feature inclusions.</p>
          </div>

          {/* Variant Tabs Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {car.variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedVariantId === v.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {v.name} (₹{v.priceLakhs}L)
              </button>
            ))}
          </div>
        </div>

        {/* Selected Variant Active Details */}
        {activeVariant && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs">
            <div>
              <span className="text-slate-500 block">VARIANT PRICE:</span>
              <span className="text-sm font-bold text-emerald-400">₹{activeVariant.priceLakhs} Lakhs</span>
            </div>
            <div>
              <span className="text-slate-500 block">POWER & TORQUE:</span>
              <span className="text-sm font-bold text-white">{activeVariant.powerBhp} PS / {activeVariant.torqueNm} Nm</span>
            </div>
            <div>
              <span className="text-slate-500 block">CLAIMED EFFICIENCY:</span>
              <span className="text-sm font-bold text-cyan-400">
                {activeVariant.mileageKmpl > 100 ? `${activeVariant.mileageKmpl} km Range` : `${activeVariant.mileageKmpl} km/l`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">TRANSMISSION:</span>
              <span className="text-sm font-bold text-indigo-400">{activeVariant.transmission} ({activeVariant.fuel})</span>
            </div>
          </div>
        )}

        {/* Specifications & Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Key Specifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Technical Specifications</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Engine / Powertrain:</span>
                <span className="text-white font-mono">{car.fuelTypes.join(', ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Ground Clearance:</span>
                <span className="text-white font-mono">{car.groundClearanceMm} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Boot Space Capacity:</span>
                <span className="text-white font-mono">{car.bootSpaceLiters} Liters</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">NCAP Safety Rating:</span>
                <span className="text-amber-400 font-bold font-mono">{car.ncapRating}-Star ({car.ncapTestAgency})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Annual Maintenance Est:</span>
                <span className="text-emerald-400 font-mono">~₹{car.annualMaintenanceEstRs.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">5-Year Resale Retention:</span>
                <span className="text-cyan-400 font-mono">{car.resaleValue5YrPercent}% Retention</span>
              </div>
            </div>
          </div>

          {/* Key Features Matrix */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Key Feature Matrix</h3>
            {activeVariant && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${activeVariant.hasSunroof ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4 shrink-0" /> Panoramic Sunroof
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${activeVariant.hasADAS ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4 shrink-0" /> Level-2 ADAS
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${activeVariant.hasVentilatedSeats ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4 shrink-0" /> Ventilated Seats
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${activeVariant.has360Camera ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4 shrink-0" /> 360 View Camera
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${activeVariant.hasWirelessCharger ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4 shrink-0" /> Wireless Charger
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${activeVariant.airbagCount >= 6 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4 shrink-0" /> {activeVariant.airbagCount} Airbags Standard
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* PROS, CONS & AI VERDICT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pros & Cons */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Pros & Cons Evaluation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider">Pros</h4>
              <ul className="space-y-1.5 text-slate-300">
                {car.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider">Cons</h4>
              <ul className="space-y-1.5 text-slate-400">
                {car.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Verdict Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" /> AI Algorithmic Verdict
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            "{car.aiVerdict}"
          </p>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <Link to={`/ownership?carId=${car.id}`} className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Ownership Cost Tool
            </Link>
            <Link to={`/finance?carId=${car.id}`} className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> EMI Studio
            </Link>
          </div>
        </div>

      </div>

      {/* SIMILAR VEHICLES */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Similar Vehicles to Consider</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarCars.map(sim => (
            <VehicleCard key={sim.id} vehicle={sim} />
          ))}
        </div>
      </div>

    </div>
  );
};
