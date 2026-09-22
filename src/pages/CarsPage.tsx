import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CARS_DATA, BRANDS, BODY_TYPES, FUEL_TYPES } from '../data/cars';
import { useApp } from '../context/AppContext';
import { VehicleCard } from '../components/ui/VehicleCard';
import { Search, Filter, SlidersHorizontal, Shield, Fuel, Gauge, ArrowRight, Bookmark, GitCompare } from 'lucide-react';

export const CarsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toggleShortlist, isShortlisted, toggleCompare, isInCompare, openTestDriveModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBody, setSelectedBody] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(70);
  const [marketFilter, setMarketFilter] = useState<string>('current');
  const [requireSunroof, setRequireSunroof] = useState(false);
  const [requireADAS, setRequireADAS] = useState(false);

  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'safety' | 'resale' | 'maintenance'>('safety');

  // Filter Cars
  const filteredCars = CARS_DATA.filter(car => {
    if (marketFilter !== 'all' && car.marketStatus && car.marketStatus !== marketFilter) {
      return false;
    }
    if (searchQuery && !car.name.toLowerCase().includes(searchQuery.toLowerCase()) && !car.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedBrand !== 'All' && car.brand !== selectedBrand) return false;
    if (selectedBody !== 'All' && car.bodyType !== selectedBody) return false;
    if (selectedFuel !== 'All' && !car.fuelTypes.includes(selectedFuel as any)) return false;
    if (car.startingPriceLakhs > maxPrice) return false;
    if (requireSunroof && !car.variants.some(v => v.hasSunroof)) return false;
    if (requireADAS && !car.variants.some(v => v.hasADAS)) return false;
    return true;
  });

  // Sort Cars
  filteredCars.sort((a, b) => {
    if (sortBy === 'priceAsc') return a.startingPriceLakhs - b.startingPriceLakhs;
    if (sortBy === 'priceDesc') return b.startingPriceLakhs - a.startingPriceLakhs;
    if (sortBy === 'safety') return b.safetyScore - a.safetyScore;
    if (sortBy === 'resale') return b.resaleScore - a.resaleScore;
    if (sortBy === 'maintenance') return b.maintenanceScore - a.maintenanceScore;
    return 0;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Car Database & Discovery</h1>
          <p className="text-xs text-slate-400">Explore and filter top vehicles available in the Indian automotive market.</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400 w-fit">
          Showing {filteredCars.length} of {CARS_DATA.length} Vehicles
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        
        {/* Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by car name or brand (e.g., Creta, Tata, Mahindra)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="safety">Highest Safety Score 🏆</option>
              <option value="resale">Best 5-Year Resale</option>
              <option value="maintenance">Lowest Maintenance</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Multi-Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          
          {/* Brand */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand</label>
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Body Type */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Body Type</label>
            <select
              value={selectedBody}
              onChange={e => setSelectedBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Fuel */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fuel Type</label>
            <select
              value={selectedFuel}
              onChange={e => setSelectedFuel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Market Availability Status */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Market Status</label>
            <select
              value={marketFilter}
              onChange={e => setMarketFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              <option value="current">Currently Sold (Default)</option>
              <option value="all font-bold text-cyan-400">All Vehicles (Inc. Discontinued & Upcoming)</option>
              <option value="discontinued">Discontinued Only</option>
              <option value="upcoming">Upcoming Launches</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Max Price: <span className="text-cyan-400 font-mono font-bold">₹{maxPrice}L</span>
            </label>
            <input
              type="range"
              min={3}
              max={70}
              step={1}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 mt-1"
            />
          </div>

          {/* Sunroof Toggle */}
          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="sunroof"
              checked={requireSunroof}
              onChange={e => setRequireSunroof(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <label htmlFor="sunroof" className="text-slate-300 text-xs cursor-pointer">Has Sunroof</label>
          </div>

          {/* ADAS Toggle */}
          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="adas"
              checked={requireADAS}
              onChange={e => setRequireADAS(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <label htmlFor="adas" className="text-slate-300 text-xs cursor-pointer">Has ADAS</label>
          </div>

        </div>

      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <VehicleCard key={car.id} vehicle={car} />
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <p className="text-base font-bold text-slate-300">No vehicles match your active filters.</p>
          <p className="text-xs">Try relaxing your price range or clearing feature toggles.</p>
        </div>
      )}

    </div>
  );
};
