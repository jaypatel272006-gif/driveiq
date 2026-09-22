import { Vehicle } from '../types/car';
import { VEHICLES_DATA } from './vehicles';

export const CARS_DATA: Vehicle[] = VEHICLES_DATA;

export const BRANDS = ['All', ...Array.from(new Set(VEHICLES_DATA.map(v => v.brand)))];
export const BODY_TYPES = ['All', 'SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe SUV', 'Compact SUV'];
export const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'];
export const TRANSMISSION_TYPES = ['All', 'Manual', 'Automatic'];
