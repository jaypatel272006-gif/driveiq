import { CARS_DATA } from '../data/cars';
import { Vehicle, BodyType, FuelType } from '../types/car';

export interface VehicleFilterOptions {
  brand?: string;
  bodyType?: string;
  fuelType?: string;
  maxPriceLakhs?: number;
  minSafetyRating?: number;
  hasSunroof?: boolean;
  hasADAS?: boolean;
  sortBy?: 'priceAsc' | 'priceDesc' | 'safety' | 'resale' | 'maintenance';
}

export function searchVehicles(query: string = '', options: VehicleFilterOptions = {}): Vehicle[] {
  const q = query.toLowerCase().trim();

  let results = CARS_DATA.filter(vehicle => {
    // Text search matching vehicle name, brand, body type, or overview text
    if (q) {
      const matchName = vehicle.name.toLowerCase().includes(q);
      const matchBrand = vehicle.brand.toLowerCase().includes(q);
      const matchBody = vehicle.bodyType.toLowerCase().includes(q);
      const matchFuel = vehicle.fuelTypes.some(f => f.toLowerCase().includes(q));
      const matchVariant = vehicle.variants.some(v => v.name.toLowerCase().includes(q));

      if (!matchName && !matchBrand && !matchBody && !matchFuel && !matchVariant) {
        return false;
      }
    }

    // Brand filter
    if (options.brand && options.brand !== 'All' && vehicle.brand !== options.brand) {
      return false;
    }

    // Body Type filter
    if (options.bodyType && options.bodyType !== 'All' && vehicle.bodyType !== options.bodyType) {
      return false;
    }

    // Fuel Type filter
    if (options.fuelType && options.fuelType !== 'All' && !vehicle.fuelTypes.includes(options.fuelType as FuelType)) {
      return false;
    }

    // Price ceiling filter
    if (options.maxPriceLakhs && vehicle.startingPriceLakhs > options.maxPriceLakhs) {
      return false;
    }

    // Safety rating filter
    if (options.minSafetyRating && vehicle.ncapRating < options.minSafetyRating) {
      return false;
    }

    // Sunroof filter
    if (options.hasSunroof && !vehicle.variants.some(v => v.hasSunroof)) {
      return false;
    }

    // ADAS filter
    if (options.hasADAS && !vehicle.variants.some(v => v.hasADAS)) {
      return false;
    }

    return true;
  });

  // Sorting
  if (options.sortBy) {
    results = [...results].sort((a, b) => {
      if (options.sortBy === 'priceAsc') return a.startingPriceLakhs - b.startingPriceLakhs;
      if (options.sortBy === 'priceDesc') return b.startingPriceLakhs - a.startingPriceLakhs;
      if (options.sortBy === 'safety') return b.safetyScore - a.safetyScore;
      if (options.sortBy === 'resale') return b.resaleScore - a.resaleScore;
      if (options.sortBy === 'maintenance') return b.maintenanceScore - a.maintenanceScore;
      return 0;
    });
  }

  return results;
}
