import { OwnershipProfile } from '../../types/database';

export const OWNERSHIP_PROFILES_DB: Record<string, OwnershipProfile> = {
  'model-creta': {
    modelId: 'model-creta',
    annualMaintenanceEstRs: 12500,
    annualInsuranceEstRs: 38000,
    warrantyYears: 3,
    warrantyKm: 100000,
    serviceIntervalMonths: 12,
    serviceIntervalKm: 10000,
    partsAvailabilityScore: 95,
    serviceNetworkScore: 92
  },
  'model-nexon-ev': {
    modelId: 'model-nexon-ev',
    annualMaintenanceEstRs: 4500,
    annualInsuranceEstRs: 34000,
    warrantyYears: 8,
    warrantyKm: 160000,
    serviceIntervalMonths: 6,
    serviceIntervalKm: 7500,
    partsAvailabilityScore: 85,
    serviceNetworkScore: 88
  },
  'model-xuv700': {
    modelId: 'model-xuv700',
    annualMaintenanceEstRs: 16000,
    annualInsuranceEstRs: 46000,
    warrantyYears: 3,
    warrantyKm: 100000,
    serviceIntervalMonths: 12,
    serviceIntervalKm: 10000,
    partsAvailabilityScore: 90,
    serviceNetworkScore: 90
  }
};
