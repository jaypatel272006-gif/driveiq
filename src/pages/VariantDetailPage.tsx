import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehicleDb } from '../data/db/vehicleDatabase';
import { useApp } from '../context/AppContext';
import { ChevronRight, Shield, Fuel, Gauge, Sliders, Calculator, Bookmark, CheckCircle, Zap, DollarSign } from 'lucide-react';

export const VariantDetailPage: React.FC = () => {
  const { brandSlug, modelSlug, variantSlug } = useParams<{ brandSlug: string; modelSlug: string; variantSlug: string }>();
  const { openTestDriveModal, toggleShortlist } = useApp();

  const data = vehicleDb.getVariantBySlug(brandSlug || '', modelSlug || '', variantSlug || '');

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">Trim Variant Not Found</h2>
        <p className="text-xs text-slate-400">No variant matching "{brandSlug}/{modelSlug}/{variantSlug}" was found.</p>
        <Link to="/cars" className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400">
          Back to Cars Catalogue
        </Link>
      </div>
    );
  }

  const { model, variant } = data;
  const brand = vehicleDb.getBrandById(model.brandId)!;
  const complete = vehicleDb.getCompleteVehicleDataByModelId(model.id)!;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/cars" className="hover:text-cyan-400">Cars</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to={`/cars/${brand.slug}/${model.slug}`} className="hover:text-cyan-400">{brand.name} {model.name}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-cyan-400 font-bold">{variant.name}</span>
      </div>

      {/* Variant Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">{brand.name}</span>
            <h1 className="text-3xl font-black text-white">{variant.name}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {variant.specifications.powerBhp} PS • {variant.specifications.torqueNm} Nm • {variant.transmission} ({variant.fuelType})
            </p>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block uppercase">EX-SHOWROOM PRICE</span>
            <span className="text-3xl font-black text-emerald-400">₹{variant.price.exShowroomPriceLakhs} Lakhs</span>
            <span className="text-[11px] text-slate-400 block font-sans">Est. On-Road: ₹{variant.price.estimatedOnRoadPriceLakhs}L</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => openTestDriveModal(model.id, `${brand.name} ${model.name}`, variant.name)}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md shadow-cyan-500/20"
          >
            Request Test Drive for this Trim →
          </button>
          <Link
            to={`/finance?carId=${model.id}`}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60"
          >
            Calculate EMI
          </Link>
          <Link
            to={`/ownership?carId=${model.id}`}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60"
          >
            Calculate 5-Yr Ownership
          </Link>
        </div>
      </div>

    </div>
  );
};
