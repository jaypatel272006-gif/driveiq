import { MarketStatus } from './database';

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Hybrid' | 'Electric' | "Doesn't matter";
export type TransmissionType = 'Manual' | 'AMT' | 'CVT' | 'DCT' | 'Torque Converter' | 'iMT' | 'Single Speed' | 'Any Automatic' | "Doesn't matter";
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'MPV' | 'Coupe SUV' | 'Crossover' | 'Compact SUV' | 'MUV' | 'Coupe' | 'Convertible' | 'Wagon' | 'Pickup';
export type BootRequirement = 'Small' | 'Medium' | 'Large' | 'Very Large';
export type PriorityCategory = 
  | 'Safety' 
  | 'Mileage' 
  | 'Performance' 
  | 'Comfort' 
  | 'Features' 
  | 'Space' 
  | 'Reliability' 
  | 'Maintenance' 
  | 'Resale' 
  | 'Looks' 
  | 'Driving Experience' 
  | 'Technology';

export interface VehicleImageSet {
  hero: string;
  front?: string;
  rear?: string;
  side?: string;
  interior?: string;
  dashboard?: string;
}

export interface Variant {
  id: string;
  name: string;
  priceLakhs: number;
  fuel: FuelType;
  transmission: TransmissionType;
  mileageKmpl: number;
  powerBhp: number;
  torqueNm: number;
  keyFeatures: string[];
  hasSunroof: boolean;
  hasADAS: boolean;
  hasVentilatedSeats: boolean;
  has360Camera: boolean;
  hasWirelessCharger: boolean;
  hasAutoAC: boolean;
  airbagCount: number;
  image?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  brandSlug?: string;
  slug?: string;
  canonicalRoute?: string;
  startingPriceLakhs: number;
  maxPriceLakhs: number;
  bodyType: BodyType;
  marketStatus?: MarketStatus;
  image: string; // Points to images.hero for compatibility
  images: VehicleImageSet;
  dataStatus?: 'verified' | 'estimated' | 'demo';
  fuelTypes: FuelType[];
  transmissions: TransmissionType[];
  seatingCapacity: number;
  bootSpaceLiters: number;
  groundClearanceMm: number;
  ncapRating: number;
  ncapTestAgency: string;
  citySuitability: number; // 0 - 10
  highwaySuitability: number; // 0 - 10
  familySuitability: number; // 0 - 10
  safetyScore: number; // 0 - 100
  comfortScore: number;
  performanceScore: number;
  featureScore: number;
  reliabilityScore: number;
  maintenanceScore: number; // 0 - 100 (higher = cheaper)
  resaleScore: number;
  technologyScore: number;
  annualMaintenanceEstRs: number;
  annualInsuranceEstRs: number;
  resaleValue5YrPercent: number;
  warrantyYears: number;
  warrantyKm: number;
  variants: Variant[];
  overview: string;
  pros: string[];
  cons: string[];
  aiVerdict: string;
}

export interface UserProfile {
  budgetLakhs: number;
  fuelPreference: FuelType;
  transmissionPreference: TransmissionType;
  cityPercentage: number;
  highwayPercentage: number;
  hillsPercentage: number;
  monthlyKm: number;
  familySize: number;
  bootRequirement: BootRequirement;
  priorities: PriorityCategory[];
}

export interface ScoreBreakdown {
  budgetFit: number;
  fuelFit: number;
  transmissionFit: number;
  usageFit: number;
  familyFit: number;
  safetyFit: number;
  comfortFit: number;
  performanceFit: number;
  runningCostFit: number;
  reliabilityFit: number;
  resaleFit: number;
}

export interface RecommendationResult {
  vehicle: Vehicle;
  matchPercentage: number;
  matchRingColor: string;
  scoreBreakdown: ScoreBreakdown;
  whyRecommend: string[];
  thingsToConsider: string[];
}

export interface TestDriveEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  carId: string;
  carName: string;
  variantName: string;
  preferredDate: string;
  preferredTime: string;
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface OwnershipCalculation {
  years: number;
  purchasePriceRs: number;
  totalFuelCostRs: number;
  totalMaintenanceRs: number;
  totalInsuranceRs: number;
  totalTaxesRs: number;
  depreciatedResaleRs: number;
  netOwnershipCostRs: number;
  costPerKmRs: number;
  monthlyCostRs: number;
}

export interface EMICalculation {
  carPriceRs: number;
  downPaymentRs: number;
  loanAmountRs: number;
  annualInterestRate: number;
  loanTenureMonths: number;
  monthlyEmiRs: number;
  totalInterestRs: number;
  totalRepaymentRs: number;
  principalRatioPercent: number;
  affordabilityStatus: 'Comfortable' | 'Stretch' | 'High Risk';
}
