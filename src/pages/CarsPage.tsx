import React, { useState } from 'react';
import { CARS_DATA, BRANDS, BODY_TYPES, FUEL_TYPES } from '../data/cars';
import { VehicleCard } from '../components/ui/VehicleCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { Search, Filter, RefreshCw, X, SlidersHorizontal, Sparkles } from 'lucide-react';

export const CarsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBody, setSelectedBody] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(70);
  const [marketFilter, setMarketFilter] = useState<string>('current');
  const [requireSunroof, setRequireSunroof] = useState(false);
  const [requireADAS, setRequireADAS] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'safety' | 'resale' | 'maintenance'>('safety');

  // Count active non-default filters
  const activeFilterCount = [
    selectedBrand !== 'All',
    selectedBody !== 'All',
    selectedFuel !== 'All',
    maxPrice < 70,
    marketFilter !== 'current',
    requireSunroof,
    requireADAS,
    searchQuery.trim().length > 0
  ].filter(Boolean).length;

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

  // Reset Filters Handler
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedBody('All');
    setSelectedFuel('All');
    setMaxPrice(70);
    setMarketFilter('current');
    setRequireSunroof(false);
    setRequireADAS(false);
  };

  // Broaden Filters Handler
  const broadenFilters = () => {
    setMaxPrice(70);
    setSelectedBrand('All');
    setRequireSunroof(false);
    setRequireADAS(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vehicle Database & Catalog</h1>
          <p className="text-xs text-slate-400">Filter across Indian passenger vehicles with verified specifications.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden btn-driveiq btn-driveiq-secondary text-xs flex items-center gap-2"
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>FILTERS</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-tech-mono bg-cyan-500 text-slate-950">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span className="px-3.5 py-1.5 rounded-lg text-xs font-tech-mono font-bold bg-[#080C14] border border-white/10 text-cyan-400">
            Showing {filteredCars.length} of {CARS_DATA.length} Vehicles
          </span>
        </div>
      </div>

      {/* Main Content Layout: Desktop Sidebar Filter + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Panel (Left Sidebar) */}
        <aside className="hidden lg:block lg:col-span-3 card-level-2 p-5 space-y-6 sticky top-20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-tech-mono text-cyan-400 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Query */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Model, brand..."
                className="input-driveiq pl-9 py-2 text-xs"
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brand</label>
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="input-driveiq text-xs py-2"
            >
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Body Type Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Body Type</label>
            <select
              value={selectedBody}
              onChange={e => setSelectedBody(e.target.value)}
              className="input-driveiq text-xs py-2"
            >
              {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Fuel Type Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fuel Type</label>
            <select
              value={selectedFuel}
              onChange={e => setSelectedFuel(e.target.value)}
              className="input-driveiq text-xs py-2"
            >
              {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-1.5 font-tech-mono">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Max Budget:</span>
              <span className="text-cyan-400 font-bold">₹{maxPrice} Lakhs</span>
            </div>
            <input
              type="range"
              min={4}
              max={70}
              step={1}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Feature Toggles */}
          <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sunroof-desktop"
                checked={requireSunroof}
                onChange={e => setRequireSunroof(e.target.checked)}
                className="accent-cyan-400 rounded"
              />
              <label htmlFor="sunroof-desktop" className="text-slate-300 cursor-pointer">Has Sunroof</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="adas-desktop"
                checked={requireADAS}
                onChange={e => setRequireADAS(e.target.checked)}
                className="accent-cyan-400 rounded"
              />
              <label htmlFor="adas-desktop" className="text-slate-300 cursor-pointer">Has ADAS (Level 2)</label>
            </div>
          </div>
        </aside>

        {/* Right Section: Sort Bar + Vehicle Cards */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Top Sort Controls */}
          <div className="card-level-1 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-tech-mono">
              <span>SORT ENGINE:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#080C14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="safety">Highest Safety Rating 🏆</option>
                <option value="resale">Best Resale Value</option>
                <option value="maintenance">Lowest Maintenance</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-tech-mono text-cyan-400 hover:underline self-end sm:self-auto"
              >
                Clear Filters ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Vehicles Grid or Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map(car => (
                <VehicleCard key={car.id} vehicle={car} />
              ))}
            </div>
          ) : (
            /* EMPTY STATE HANDLING */
            <div className="card-level-2 p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
                <Search className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">No Exact Vehicle Matches</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No vehicles in our database fit all of your active filter criteria simultaneously. Try broadening your budget or clearing feature toggles.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={broadenFilters}
                  className="btn-driveiq btn-driveiq-primary text-xs"
                >
                  Broaden Filters (Increase Budget)
                </button>
                <button
                  onClick={resetFilters}
                  className="btn-driveiq btn-driveiq-secondary text-xs"
                >
                  Reset All Filters
                </button>
              </div>

              {/* Similar Vehicles Suggestions */}
              <div className="pt-8 border-t border-white/10 text-left space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Suggested Popular Vehicles You Might Like:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CARS_DATA.slice(0, 2).map(car => (
                    <VehicleCard key={car.id} vehicle={car} />
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM-SHEET FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md p-0 sm:p-4">
          <div className="w-full max-w-lg card-level-3 p-6 rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}
                </h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Controls */}
            <div className="space-y-4">
              
              {/* Brand */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="input-driveiq text-xs py-2.5"
                >
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Body Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Body Type</label>
                <select
                  value={selectedBody}
                  onChange={e => setSelectedBody(e.target.value)}
                  className="input-driveiq text-xs py-2.5"
                >
                  {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Fuel Type</label>
                <select
                  value={selectedFuel}
                  onChange={e => setSelectedFuel(e.target.value)}
                  className="input-driveiq text-xs py-2.5"
                >
                  {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Max Price Range Slider */}
              <div className="space-y-2 font-tech-mono pt-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Max Budget:</span>
                  <span className="text-cyan-400 font-bold">₹{maxPrice} Lakhs</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={70}
                  step={1}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Feature Toggles */}
              <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sunroof-mobile"
                    checked={requireSunroof}
                    onChange={e => setRequireSunroof(e.target.checked)}
                    className="accent-cyan-400 rounded w-4 h-4"
                  />
                  <label htmlFor="sunroof-mobile" className="text-slate-300">Has Sunroof</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="adas-mobile"
                    checked={requireADAS}
                    onChange={e => setRequireADAS(e.target.checked)}
                    className="accent-cyan-400 rounded w-4 h-4"
                  />
                  <label htmlFor="adas-mobile" className="text-slate-300">Has Level-2 ADAS</label>
                </div>
              </div>

            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={resetFilters}
                className="btn-driveiq btn-driveiq-secondary flex-1 text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-driveiq btn-driveiq-primary flex-1 text-xs"
              >
                Apply Filters ({filteredCars.length})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
