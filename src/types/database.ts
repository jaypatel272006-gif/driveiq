export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Hybrid' | 'Electric' | "Doesn't matter";
export type TransmissionType = 'Manual' | 'AMT' | 'CVT' | 'DCT' | 'Torque Converter' | 'iMT' | 'Single Speed' | 'Any Automatic' | "Doesn't matter";
export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'Compact SUV' | 'MPV' | 'MUV' | 'Coupe' | 'Convertible' | 'Wagon' | 'Pickup' | 'Coupe SUV' | 'Crossover';
export type FeatureCategory = 'Comfort' | 'Technology' | 'Convenience' | 'Exterior' | 'Parking' | 'Safety';
export type FeatureStatus = 'standard' | 'optional' | 'unavailable';
export type DataQualityTag = 'VERIFIED' | 'ESTIMATED' | 'DEMO' | 'verified' | 'estimated' | 'demo';
export type ResaleConfidence = 'High' | 'Medium' | 'Low';
export type MarketStatus = 'current' | 'discontinued' | 'upcoming' | 'temporarily_unavailable' | 'unknown';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  country: string;
  description: string;
  website?: string;
  active: boolean;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  slug: string; // Model slug e.g. "alto-k10"
  brandSlug?: string; // Brand slug e.g. "maruti-suzuki"
  canonicalRoute?: string; // e.g. "/cars/maruti-suzuki/alto-k10"
  marketStatus: MarketStatus;
  bodyType: BodyType;
  description: string;
  startingPriceLakhs: number;
  endingPriceLakhs: number;
  seatingCapacity: number;
  availableFuelTypes: FuelType[];
  availableTransmissions: TransmissionType[];
  heroImage: string;
  gallery: string[];
  active: boolean;
  dataSource?: string;
  dataSourceUrl?: string;
  dataVerifiedAt?: string;
  dataStatus?: DataQualityTag;
}

export interface Specification {
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  wheelbaseMm: number | null;
  groundClearanceMm: number | null;
  kerbWeightKg: number | null;
  seatingCapacity: number;
  bootSpaceLiters: number | null;
  fuelTankCapacityLiters: number | null;
  powerBhp: number;
  torqueNm: number;
  acceleration0To100Sec: number | null;
  topSpeedKmph: number | null;
  claimedMileageKmpl: number | null;
  claimedRangeKm: number | null;
  realWorldRangeKm: number | null;
  batteryCapacityKwh: number | null;
  chargingTimeHours: number | null;
  fastChargingSupport: boolean;
  homeChargingCostPerKm: number | null;
  engineDisplacementCc: number | null;
  cylinderCount: number | null;
}

export interface PriceBreakdown {
  exShowroomPriceLakhs: number;
  estimatedOnRoadPriceLakhs: number;
  insuranceEstRs: number;
  registrationEstRs: number;
  taxesEstRs: number;
  optionalAccessoriesEstRs: number;
  priceStatus: DataQualityTag;
}

export interface Feature {
  id: string;
  name: string;
  category: FeatureCategory;
  description: string;
}

export interface VariantFeatureAssignment {
  variantId: string;
  featureId: string;
  status: FeatureStatus;
}

export interface SafetyProfile {
  id: string;
  modelId: string;
  officialNcapRating: number | null;
  ncapTestingAgency: string | null;
  adultProtectionPercentage: number | null;
  childProtectionPercentage: number | null;
  airbagCount: number;
  abs: boolean;
  esc: boolean;
  hillHold: boolean;
  tractionControl: boolean;
  rearCamera: boolean;
  parkingSensors: boolean;
  camera360: boolean;
  hasADAS: boolean;
  blindSpotMonitoring: boolean;
  laneKeepAssist: boolean;
  adaptiveCruiseControl: boolean;
  autonomousEmergencyBraking: boolean;
  isofixChildSeatMounts: boolean;
  tpms: boolean;
  dataQuality: DataQualityTag;
}

export interface DriveIQScores {
  safetyScore: number;
  comfortScore: number;
  performanceScore: number;
  featureScore: number;
  reliabilityScore: number;
  maintenanceScore: number;
  ownershipScore: number;
  resaleScore: number;
  citySuitability: number;
  highwaySuitability: number;
  familySuitability: number;
  valueForMoneyScore: number;
}

export interface OwnershipProfile {
  modelId: string;
  annualMaintenanceEstRs: number;
  annualInsuranceEstRs: number;
  warrantyYears: number;
  warrantyKm: number;
  serviceIntervalMonths: number;
  serviceIntervalKm: number;
  partsAvailabilityScore: number;
  serviceNetworkScore: number;
}

export interface ResaleProfile {
  modelId: string;
  resaleAfter1YearPercent: number;
  resaleAfter3YearsPercent: number;
  resaleAfter5YearsPercent: number;
  annualDepreciationRatePct: number;
  resaleConfidence: ResaleConfidence;
}

export interface Variant {
  id: string;
  modelId: string;
  name: string;
  slug: string;
  price: PriceBreakdown;
  fuelType: FuelType;
  transmission: TransmissionType;
  specifications: Specification;
  warrantyYears: number;
  warrantyKm: number;
  active: boolean;
}

export interface CompleteVehicleData {
  model: VehicleModel;
  brand: Brand;
  variants: Variant[];
  safety: SafetyProfile;
  scores: DriveIQScores;
  ownership: OwnershipProfile;
  resale: ResaleProfile;
  featuresMap: Record<string, FeatureStatus>;
}
